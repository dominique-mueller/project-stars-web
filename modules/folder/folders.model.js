
require('es6-promise').polyfill();
var Folder = require('../schemaExport.js').Folder;
var logger = require('../../adapters/logger.js');


var FoldersModel = function(caller, userId){
	logger.debug('FOLDER MODEL');

	var self; //@see: adapters/authentication.js 
	this.userId;

	function createRootFolder(folder){
		return new Promise(function(resolve, reject){
			//TODO: FIX BUG change this check so no user can send a path with 'undefined'
			// if a root folder is created, there is no path, so the path's id will be the folder itself
			folder.position = 0;
			folder.path = folder._id;
			resolve(folder);
		});
	}

	function createNormalFolder(folder){
		return new Promise(function(resolve, reject){
			var positionPromise = changeNumberOfContainedElements(folder.path, 1);
			positionPromise.then(function(highestPosition){
				logger.debug('highestPosition: '+highestPosition);
				folder.position = highestPosition;
				resolve(folder);
			})
			.catch(function(err){
				logger.error("FUKING ERROR: " + err);
				reject(err);
			});
		});
	}

	function checkIfRootFolder(folderId){
		return new Promise(function(resolve, reject){
			Folder.findById(folderId, function(err, folder){
				if(err){
					reject(err);
				}
				else{
					if(folder.name !== '.'){
						resolve(folder);
					}
					else{
						reject(new Error('The root folder can not be deleted'));
					}		
				}
			});
		}); 
	}

	function moveFolder(folderId, folderData, callback){
		var folderPromise = self.findOne(folderId);
		folderPromise.then(function(folder){
			if(folderData.hasOwnProperty('path')){
				folder.path = folderData.path;
			}
			if(folderData.hasOwnProperty('position')){
				folder.position = folderData.position;
			}

			var deleteFolderPromise = self.delete(folderId);
			var alterPathPromise = changeNumberOfContainedElements(folder.path, +1);
			var shiftFoldersPromise = shiftFoldersPosition(folder.path, folder.position, +1);
			var shiftBookmarksPromise = caller.shiftBookmarksPosition(folder.path, folder.position, +1);
			var saveFolderPromise = saveAndReturnPromise(folder);
			Promise.all([deleteFolderPromisem alterPathPromise, shiftBookmarksPromise, shiftFoldersPromise, saveAndReturnPromise])
			.then(function(){
				callback(null);
			})
			.catch(callback);
		}
		.catch(callback);	
	}

	/*
	@param path: the folder id of the 'parent' folder, called path
	@param changeBy: the number of how many should be added (negative numbers also possible)
	@resolve: gives back the new numberOfContainedElements 
	@return: returns a promise 
	*/
	function changeNumberOfContainedElements(path, changeBy){
		return new Promise(function(resolve, reject){
			Folder.findById(path, function(err, folder){
				folder.numberOfContainedElements = folder.numberOfContainedElements + changeBy;
				folder.save(function(err, folder){
					if(err){
						logger.error(err);
						reject(err);
					}
					else{
						resolve(folder.numberOfContainedElements);
					}
				});
			});
		});
	}

	function shiftFoldersPosition(path, startPosition, shift){
		return new Promise(function(resolve, reject){
			var allFolderPromise = self.findAll();
			allFolderPromise.then(function(folderArray){
				folderArray = sortFolders(folderArray);
				var savePromiseArray = new Array(folderArray.length);
				for(var i = startPosition; i < folderArray.length; i++){
					folderArray[i].position = folderArray[i].position + shift;
					savePromiseArray[i] = saveAndReturnPromise(folderArray[i]);
				}
				Promise.all(savePromiseArray).then(function(){
					resolve();
				})
				.catch(reject);
			})
			.catch(reject);
		});
	}

	function saveAndReturnPromise(element){
		return new Promise(function(resolve, reject){
			element.save(function(err){
				if(err){
					reject(err);
				}
				else{
					resolve();
				}
			});
		});
	}

	function sortFolders(folders){
		var sortedFolders = new Array(folders.length);
		for(var i = 0; i < folders.length; i++){
			sortedFolders[folders[i].position - 1] = folders[i];
		}
		return sortedFolders;
	}

	//#### Public Functions #####

	this.findAll = function(){
		return new Promise(function(resolve, reject){
			// Folder.find({owner:self.userId},{sort:[['position', 'desc']]}, function(err, folders){
			Folder.find({owner:self.userId}, function(err, folders){
				if(err){
					reject(err);
				}
				else{
					resolve(folders);
				}
			});
		});
	}; 

	this.create = function(folderData){
		return new Promise(function(resolve, reject){	
			var folder = new Folder({
				name: folderData.name,
				owner: self.userId,
				path: folderData.path
			});
			var folderPromise;
			if(typeof folderData.path === 'undefined'){ 
				folderPromise = createRootFolder(folder);
			}
			else{
				logger.debug('call create normal folder ');
				folderPromise = createNormalFolder(folder);
			}
			folderPromise.then(function(folder){
				logger.debug("Name: " + folder.name + "_-_Position: " + self.userId);
				folder.save(function(err, folder){
					if(err){
						reject(err);
					}
					else{
						resolve(folder);
					}
				});
			})
			.catch(reject);
		});
	};

	this.update = function(folderId, folderData){
		return new Promise(function(resolve, reject){
		if(folderData.hasOwnProperty('name')){
			Folder.findByIdAndUpdate(folderId, {"name":folderData.name}, {new:true}, function(err){
				if(err){
					reject(err);
				}
				else{
					resolve();
				}
			});
		}
		else{
			moveFolder(folderId, folderData, function(err){
				if(err){
					reject();
				}
				else{
					resolve();
				}
			});
		}
		});
	};
	
	this.delete = function(folderId){
		return new Promise(function(resolve, reject){
			// the root folder of each user can only be deleted together with the user
			// so it must be ensured that not accidentially the folderId is the root folder
			logger.debug('FOLDER ID: ' + folderId);
			var folderPromise = self.findOne(folderId);
			folderPromise.then(function(folder){
				var shiftFoldersPromise = shiftFoldersPosition(folder.path, folder.position, -1);
				var shiftBookmarksPromise = caller.shiftBookmarksPosition(folder.path, folder.position, -1);
				var alterPathPromise = changeNumberOfContainedElements(folder.path, -1);
				Promise.all([shiftFoldersPosition, shiftBookmarksPosition, alterPathPromise]).then(function(resolveArray){
					Folder.findByIdAndRemove(folderId, function(err){
						if(err){
							logger.debug('Promise all error');
							reject(err);
						}
						else{
							resolve();
						}
					});
				})
				.catch(function(){
					reject(new Error('Something went wrong durring the deletion of the folder: ' + folderId));
					//TODO Rollback of successful actions
				});
			})
			.catch(reject);
		});
	};

	this.findOne = function(folderId){
		return new Promise(function(resolve, reject){
			logger.debug('OWNER: ' + self.userId);
			Folder.find({"_id":folderId, "owner":self.userId}, function(err, folder){
				if(err || folder.length > 1){
					err = err || new Error('Failed to find the folder');
					reject(err);
				} 
				else{
					logger.debug('RESOLVE SEARCH: ' + folder);
					resolve(folder[0]);
				}
			});
		});
	};

	self = this;
	this.userId = userId;

	return this;
}

module.exports = FoldersModel;