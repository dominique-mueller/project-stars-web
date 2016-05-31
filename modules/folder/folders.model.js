
require('es6-promise').polyfill();
var Folder = require('../schemaExport.js').Folder;
var logger = require('../../adapters/logger.js');


var FoldersModel = function(caller, userId){
	logger.debug('FOLDER MODEL');

	var self; //@see: adapters/authentication.js 
	this.userId;

	//#### PRIVATE FUNCTIONS ####

	function createRootFolder(folder){
		return new Promise(function(resolve, reject){
			//TODO: FIX BUG change this check so no user can send a path with 'undefined'
			// if a root folder is created, there is no path, so the path's id will be the folder itself
			folder.position = 0;
			folder.path = self.userId;
			resolve(folder);
		});
	}

	function createNormalFolder(folder){
		return new Promise(function(resolve, reject){
			var positionPromise = self.changeNumberOfContainedElements(folder.path, 1);
			positionPromise.then(function(highestPosition){
				logger.debug('highestPosition: '+highestPosition);
				folder.position = highestPosition;
				resolve(folder);
			})
			.catch(function(err){
				logger.error("FUCKING ERROR: " + err);
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
			deleteFolderPromise.then(function(){
				logger.debug('NOW INSERT ON NEW position: ' + folder.position);
				var changeNumberOfContainedElementsPromsie = self.changeNumberOfContainedElements(folder.path, +1);
				var shiftFoldersPromise = self.shiftFoldersPosition(folder.path, folder.position -1, +1);
				var shiftBookmarksPromise = caller.shiftBookmarksPosition(folder.path, folder.position -1, +1);
				//Something did not went ecwell, but it could have been also the work of another bug so maybe we should try it again
				// var saveFolderPromise = saveFolderAndReturnPromise(folder);
				var createFolderPromise = new Promise(function(resolve, reject){
					Folder.create(folder);
				});
				Promise.all([changeNumberOfContainedElementsPromsie, shiftBookmarksPromise, shiftFoldersPromise, saveFolderAndReturnPromise])
				.then(function(){
					callback(null);
				})
				.catch(callback);
			})
			.catch(callback);
		})
		.catch(callback);	
	}

	function saveFolderAndReturnPromise(element){
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

	function sortFoldersAfterPositionASC(folders){
		return folders.sort(function(a, b){
			return a.position - b.position;
		});
	}

	//This function will change the position of all other element in the folder 
	//and decrement the numberOfContainedElements from path folder
	function updateAffectedElements(folder){
		return new Promise(function(resolve, reject){
			var shiftFoldersPromise = self.shiftFoldersPosition(folder.path, folder.position, -1);
			var shiftBookmarksPromise = caller.shiftBookmarksPosition(folder.path, folder.position, -1);
			var changeNumberOfContainedElementsPromsie = self.changeNumberOfContainedElements(folder.path, -1);
			Promise.all([shiftFoldersPromise, shiftBookmarksPromise, changeNumberOfContainedElementsPromsie]).then(function(resolveArray){
				logger.debug('all updateAffectedElements resolve');
				resolve();
			})
			.catch(function(){
				logger.error('something went wrong with updateAffectedElements');
				reject(new Error('Something went wrong durring the deletion of the folder: ' + folderId));
				//TODO Rollback of successful actions
			});
		});
	}


	//#### Public Functions #####

 	this.checkIfPathRegardsToOwner = function(path){
		return new Promise(function(resolve, reject){
			//TODO !!!!
			logger.debug('checkIfPathRegardsToOwner');
			resolve(true);
		});
	}

	/*
	@param path: the folder id of the 'parent' folder, called path
	@param changeBy: the number of how many should be added (negative numbers also possible)
	@resolve: gives back the new numberOfContainedElements 
	@return: returns a promise 
	*/
	this.changeNumberOfContainedElements = function(path, changeBy){
			// logger.debug('START: changeNumberOfContainedElements ');
		return new Promise(function(resolve, reject){
			Folder.findById(path, function(err, folder){
				// logger.debug('changeNumberOfContainedElements folder: ' + folder.name);
				try{
					folder.numberOfContainedElements = folder.numberOfContainedElements + changeBy;
					folder.save(function(err, folder){
						if(err){
							logger.error(err);
							reject(err);
						}
						else{
							logger.debug('changeNumberOfContainedElements resolved');
							resolve(folder.numberOfContainedElements);
						}
					});
				}
				catch(err){
					reject(err);
				}
			});
		});
	}

	this.shiftFoldersPosition = function(path, startPosition, shift){
		// logger.debug('shiftFoldersPosition');
		return new Promise(function(resolve, reject){
			var allFolderPromise = self.findAll(path);
			allFolderPromise.then(function(folderArray){
				// logger.debug('shiftFolders');
				folderArray = sortFoldersAfterPositionASC(folderArray);
				// logger.debug('shift folders sorted: ' + folderArray);
				logger.debug('FolderArray.length: ' + folderArray.length);
				logger.debug('startPosition: ' + startPosition);
				var savePromiseArray = new Array();
				for(var i = 0; i < folderArray.length; i++){
					logger.debug('FolderName: ' + folderArray[i].name);
					if(folderArray[i].position > startPosition){
						logger.debug('new folder ('+ folderArray[i].name +') position: ' + folderArray[i].position);
						folderArray[i].position = folderArray[i].position + shift;
						savePromiseArray.push(saveFolderAndReturnPromise(folderArray[i]));
					}
				}
				Promise.all(savePromiseArray).then(function(){
					logger.debug('save all promise fullfiled');
					resolve();
				})
				.catch(reject);
			})
			.catch(reject);
		});
	};

	this.findAll = function(path){
		return new Promise(function(resolve, reject){
			// Folder.find({owner:self.userId},{sort:[['position', 'desc']]}, function(err, folders){
			var contrains = {
				owner: self.userId
			};
			if(path){
				contrains['path'] = path;
			}
			Folder.find(contrains, function(err, folders){
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
			var folderPromise = self.findOne(folderId);
			folderPromise.then(function(folder){
				logger.debug('folderPromise');
				if(folder.name !== '.'){
					logger.debug('non root folder');
					var updateAffectedElementsPromise = updateAffectedElements(folder);
					updateAffectedElementsPromise.then(function(){
						logger.debug('updateAffectedElementsPromise fullfiled');
						Folder.findByIdAndRemove(folderId, function(err){
							if(err){
								reject(err);
							}
							else{
								resolve();
							}
						});
					})
					.catch(reject);
				}
				else{
					reject(new Error('The root folder can not be deleted'));
				}
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