require('es6-promise').polyfill();
var Folder = require('../schemaExport.js').Folder;
var logger = require('../../adapters/logger.js');

function checkIfRootFolder(folderId, callback){
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

function changeNumberOfContainedElements(path, changeFact, callback){
	return new Promise(function(resolve, reject){
		Folder.findById(path, function(err, folder){
			folder.numberOfContainedElements = folder.numberOfContainedElements + changeFact;
			folder.save(function(err, folder){
				if(err){
					logger.error(err);
					reject(err);
				}
				else{
					reject();
				}
			})
		});
	});
}

module.exports = {

	create: function(folderData, userId){
		return new Promise(function(resolve, reject){	
			var folder = new Folder({
				name: folderData.name,
				owner: userId,
				path: folderData.path,
				position: folderData.position
			});
			if(typeof folderData.path === 'undefined'){ 
				// if a root folder is created, there is no path, so the path's id will be the folder itself
				folder.path = folder._id;
			}
			folder.save(function(err, folder){
				if(err){
					reject(err);
				}
				else{
					resolve(folder);
				}
			});
		});
	},

	update: function(folderId, folderData){
		checkIfRootFolder(folderId, function(err){
			if(err){
				reject(err);
			}
			else{
				Folder.findByIdAndUpdate(folderId, folderData, function(err){

				});
			}
		});
	},

	delete: function(folderId){
		return new Promise(function(resolve, reject){
			// the root folder of each user can only be deleted together with the user
			// so it must be ensured that not accidentially the folderId is the root folder
			checkIfRootFolder(folderId, function(err, folder){
				if(err){
					reject(err);
				}
				else{
					Folder.remove({_id: folderId}, function(err){
						if(err){
							// reject(err);
						}
						else{
							changeNumberOfContainedElements(folder.path, -1, function(){
								// resolve();
							});
						}
					});
				}
			});					
		});
	},

	findOne: function(folderId, userId){
		return new Promise(function(resolve, reject){
			Folder.findOne({_id:folderId, owner:userId}, function(err, folder){
				if(err){
					reject(err);
				} 
				else{
					resolve(folder);
				}
			});
		});
	},

	findAll: function(userId){
		return new Promise(function(resolve, reject){
			Folder.find({owner:userId}, function(err, folders){
				if(err){
					reject(err);
				}
				else{
					resolve(folders);
				}
			});
		});
	}

}