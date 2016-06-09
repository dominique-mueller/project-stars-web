var Folder = require('../schemaExport.js').Folder;
var logger = require('../../adapters/logger.js');


var FoldersModel = function(userId){

	var self; //@see: adapters/authentication.js 
	this.userId;

	//#### PRIVATE FUNCTIONS ####


	function checkIfRootFolder(folderId){
		return new Promise(function(resolve, reject){
			Folder.findById(folderId, function(err, folder){
				if(err){
					reject(err);
				}
				else{
					if(folder.isRoot){
						resolve(folder);
					}
					else{
						reject(new Error('The root folder can not be deleted'));
					}		
				}
			});
		}); 
	}

	//TODO: create model prototype and pull this function to the prototype
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

	//TODO: create model prototype and pull this function to the prototype
	function sortFoldersAfterPositionASC(folders){
		return folders.sort(function(a, b){
			return a.position - b.position;
		});
	}


	//#### Public Functions #####

	//KEEP THESE FUNCTIONS. DUE TO FRONTEND COMPATIBILITY FOR RELEASE THEY HAD TO BE SIMPLICIFIED
	
 	// 	this.checkIfPathRegardsToOwner = function(path){
	// 	return new Promise(function(resolve, reject){
	// 		//TODO !!!!
	// 		logger.debug('checkIfPathRegardsToOwner');
	// 		resolve(true);
	// 	});
	// }

	/*
	@param path: the folder id of the 'parent' folder, called path
	@param changeBy: the number of how many should be added (negative numbers also possible)
	@resolve: gives back the new numberOfContainedElements 
	@return: returns a promise 
	*/
	// this.changeNumberOfContainedElements = function(path, changeBy){
	// 	// logger.debug('START: changeNumberOfContainedElements ');
	// 	logger.debug('folder model changeNumberOfContainedElements');
	// 	return new Promise(function(resolve, reject){
	// 		Folder.findById(path, function(err, folder){
	// 			// logger.debug('changeNumberOfContainedElements folder: ' + folder.name);
	// 			try{
	// 				folder.numberOfContainedElements = folder.numberOfContainedElements + changeBy;
	// 				folder.save(function(err, folder){
	// 					if(err){
	// 						logger.error(err);
	// 						reject(err);
	// 					}
	// 					else{
	// 						logger.debug('changeNumberOfContainedElements resolved');
	// 						resolve(folder.numberOfContainedElements);
	// 					}
	// 				});
	// 			}
	// 			catch(err){
	// 				reject(err);
	// 			}
	// 		});
	// 	});
	// }

	this.changeNumberOfContainedFolders = function(path, changeBy){
		return new Promise(function(resolve, reject){
			Folder.findById(path, function(err, foundFolder){
				try{
					foundFolder.numberOfContainedFolders = foundFolder.numberOfContainedFolders + changeBy;
					foundFolder.save(function(err, savedFolder){
						if(err){
							logger.error(err);
							reject(err);
						}
						else{
							// logger.debug('changeNumberOfContainedFolders resolved');
							resolve(savedFolder.numberOfContainedFolders);
						}
					});
				}
				catch(err){
					reject(err);
				}
			});
		});
	}


	//The startPosition won't be affected, 
	// so if you plan to shift folders to get an empty position you have set the startPosition to <planedFreePosition> - 1 
	this.shiftFoldersPosition = function(path, startPosition, shift){
		logger.debug('folder model shiftFoldersPosition');
		return new Promise(function(resolve, reject){
			var allFolderPromise = self.findAll(path);
			allFolderPromise.then(function(folderArray){
				// logger.debug('shiftFolders');
				folderArray = sortFoldersAfterPositionASC(folderArray);
				var savePromiseArray = new Array();
				for(var i = 0; i < folderArray.length; i++){
					//logger.debug('FolderName: ' + folderArray[i].name);
					if(folderArray[i].position > startPosition){
						// logger.debug('new folder ('+ folderArray[i].name +') position: ' + folderArray[i].position);
						folderArray[i].position = folderArray[i].position + shift;
						savePromiseArray.push(saveAndReturnPromise(folderArray[i]));
					}
				}
				Promise.all(savePromiseArray).then(function(){
					logger.debug('shifted folder');
					// logger.debug('save all promise fullfiled');
					resolve();
				})
				.catch(reject);
			})
			.catch(reject);
		});
	};


	this.create = function(folderData){
		return new Promise(function(resolve, reject){	
			var folder = new Folder({
				name: folderData.name,
				owner: self.userId,
				path: folderData.path
			});

			var positionPromise = self.changeNumberOfContainedFolders(folder.path, 1);
			positionPromise.then(function(highestPosition){
				// logger.debug('highestPosition: '+highestPosition);
				folder.position = highestPosition;
				folder.save(function(err, folder){
					if(err){
						reject(err);
					}
					else{
						resolve(folder);
					}
				});
			})
			.catch(function(err){
				logger.error("FUCKING ERROR: " + err);
				reject(err);
			});
		});
	};


	this.createRootFolder = function(){
		return new Promise(function(resolve, reject){
			var folder = new Folder({
				name: '.',
				owner: self.userId,
				isRoot: true,
				position: 1
			});
			folder.path = folder._id;
			folder.save(function(err, foldr){
				if(err){
					reject(err);
				}
				else{
					resolve(folder);
				}
			});
		});
	};


	this.update = function(folderId, folderData){
		return {
			updateMoveFolderPathOrPosition: function(){
				logger.debug("updateMoveFolderPathOrPosition");
				return new Promise(function(resolve, reject){
					var promiseList = new Array();
					var folderPromise = self.findOne(folderId);
					folderPromise.then(function(folder){
						
						if(folder.isRoot){
							reject(new Error("Root folder can not be manipulated"));
						}

						if(folderData.hasOwnProperty('path')){ //if a path is in the update data, there has also to be a position
							promiseList.push(self.shiftFoldersPosition(folder.path, folder.position, -1));
							promiseList.push(self.changeNumberOfContainedFolders(folder.path, -1));
							folder.path = folderData.path;
							promiseList.push(self.changeNumberOfContainedFolders(folder.path, 1));
							logger.debug("folder path will be changed");
						}

						folder.position = folderData.position;
						promiseList.push(self.shiftFoldersPosition(folder.path, folder.position -1, 1));

						Promise.all(promiseList).then(function(){
							saveAndReturnPromise(folder).then(function(){
								resolve();
							})
							.catch(reject)
						})
						.catch(reject);

					})
					.catch(reject);			
	
				});
			},

			updateFolderEditables: function(){
				logger.debug("updateFolderEditables");

				return new Promise(function(resolve, reject){
					Folder.findByIdAndUpdate(folderId, {"name":folderData.name}, {new:true}, function(err){
						if(err){
							reject(err);
						}
						else{
							resolve();
						}
					});
				});
			}
		};
	};

	
	this.delete = function(folderId){
		return new Promise(function(resolve, reject){
			var folderPromise = self.findOne(folderId);
			folderPromise.then(function(folder){
				// logger.debug('folderPromise');
				if(!folder.isRoot){
					// logger.debug('non root folder');
					var shiftFoldersPromise = self.shiftFoldersPosition(folder.path, folder.position, -1);
					var changeNumberOfContainedFoldersPromsie = self.changeNumberOfContainedFolders(folder.path, -1);
					Promise.all([shiftFoldersPromise, changeNumberOfContainedFoldersPromsie]).then(function(resolveArray){
						Folder.findByIdAndRemove(folderId, function(err){
							if(err){
								reject(err);
							}
							else{
								resolve();
							}
						});
					})
					.catch(function(){
						logger.error('something went wrong with updateAffectedElements');
						reject(new Error('Something went wrong durring the deletion of the folder: ' + folderId));
						//TODO Rollback of successful actions
					});
				}
				else{
					reject(new Error('The root folder can not be deleted'));
				}
			})
			.catch(reject);
		});
	};

	//@param path: if path is given this function will only search for folders within this path
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