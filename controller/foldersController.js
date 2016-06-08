var logger = require('../adapters/logger.js');
var httpStatus = require('../config.js').httpStatus;
var helpers = require('../helpers/generalHelpers.js');

var FoldersController = function(req, res, authentication){

	var self = this; //@see: adapters/authentication.js 
	this.authentication = authentication;
	this.Folder = require('../modules/folder/folders.model.js');
	this.Folder = new Folder(authentication.tokenUserId);
	this.Bookmark = require('../modules/bookmark/bookmarks.model.js');
	this.Bookmark = new Bookmark(authentication.tokenUserId);
	this.req = req;
	this.res = res;
	this.reqBody;


	//CONSTRUCTOR
	if(req.method != 'GET' && req.method != 'DELETE'){
		this.reqBody = JSON.parse(req.body.data);
	}	


	//#### PRIVATE FUNCTIONS ####

	function respondeWithError(message){
		return function(err){
			logger.error("respondeWithError: "  + message + " :: " + err);
			self.res.status(httpStatus.BAD_REQUEST)
			.json({'error':message});
		}
	}

	function deleteSubFolders(pathId){
		logger.debug('deleteSubFolders: ' + pathId);
		return new Promise(function(resolve, reject){
			var findSubFolderPromise = Folder.findAll(pathId);
			findSubFolderPromise.then(function(folders){
				var deletePromises = new Array();
				for(var i = 0; i < folders.length; i++){
					logger.debug('Delete Subfolder with the Id:' + folders[i]._id);
					deletePromises.push(recursiveDelete(folders[i]._id));
				}
				Promise.all(deletePromises).then(function(){
					resolve();
				})
				.catch(reject);
			})
			.catch(function(){
				logger.info("Can't find any sub Folder. PathId: " + pathId);
				resolve();
			});
		});	
	}

	function deleteSubBookmarks(pathId){
		logger.debug('deleteSubBookmarks: ' + pathId);
		return new Promise(function(resolve, reject){
			var findSubBookmarksPromise = Bookmark.findAll(pathId);
			findSubBookmarksPromise.then(function(bookmarks){
				var deletePromises = new Array();
				for(var i = 0; i < bookmarks.length; i++){
					logger.debug('Delete Subbookmark with the Id:' + bookmarks[i]._id);
					deletePromises.push(Bookmark.delete(bookmarks[i]._id));
				}
				Promise.all(deletePromises).then(function(){
					resolve();
				})
				.catch(reject);
			})
			.catch(function(){
				logger.info("Can't find any sub Bookmarks. PathId: " + pathId);
				resolve();
			});
		});
	}

	function recursiveDelete(folderId){
		var deleteSubFolderPromise = deleteSubFolders(folderId);
		var deleteSubBookmarksPromise = deleteSubBookmarks(folderId);
		return new Promise(function(resolve, reject){
			Promise.all([deleteSubFolderPromise, deleteSubBookmarksPromise]).then(function(){
				var deleteFolderPromise = Folder.delete(folderId);
				deleteFolderPromise.then(function(){
					resolve();
				})
				.catch(reject);
			})
			.catch(reject);
		});
	}

	//#### PUBLIC FUNCTIONS ####
	
	//TODO see this.Folder initialization 
	// this.shiftBookmarksPosition = function(path, startPosition, shift){
	// 	return require('../modules/bookmark/bookmarks.model.js')(self, self.authentication.tokenUserId).shiftBookmarksPosition(path, startPosition, shift);	
	// }

	this.get = function(){
		var folderPromise = Folder.findOne(self.req.params.folder_id);
		folderPromise.then(function(folder){
			res.status(httpStatus.OK)
				.json({'data':
					helpers.mongooseObjToFrontEndObj(folder)
				}
			);
		})
		.catch(respondeWithError(''));
	};


	this.getAll = function(){
		var folderPromise = Folder.findAll(null);
		folderPromise.then(function(folders){
			self.res.status(httpStatus.OK)
				.json({'data':
					helpers.mongooseObjToFrontEndObj(folders)
				}
			);
		})
		.catch(respondeWithError(''));
	};


	this.post = function(){
		//TODO: use isRoot field instead of owner == path for the root folder
		var folderCreatePromise = Folder.create(self.reqBody);
		folderCreatePromise.then(function(folder){
			self.res.status(httpStatus.OK)
			.json({'data':
				helpers.mongooseObjToFrontEndObj(folder)
			});
		})
		.catch(respondeWithError('could not create the folder'));
	};


	this.put = function(){
		var folderUpdatePromise;
		var folderUpdate = Folder.update(self.req.params.folder_id, self.reqBody);
		if(self.reqBody.hasOwnProperty('name')){
			folderUpdatePromise = folderUpdate.updateFolderEditables();
		}
		else{
			folderUpdatePromise = folderUpdate.updateMoveFolderPathOrPosition();
		}

		folderUpdatePromise.then(function(){
			self.res.status(httpStatus.NO_CONTENT).end();
		})
		.catch(respondeWithError('could not update the folder'));
	};


	this.delete = function(folderId){
		var deleteSubFolderPromise = deleteSubFolders(self.req.params.folder_id);
		var deleteSubBookmarksPromise = deleteSubBookmarks(self.req.params.folder_id);
		Promise.all([deleteSubFolderPromise, deleteSubBookmarksPromise]).then(function(){
			logger.debug("just the deletion of the actual folder has to be done");
			var deleteFolderPromise = Folder.delete(self.req.params.folder_id);
			deleteFolderPromise.then(function(){
				self.res.status(httpStatus.NO_CONTENT).end();
			})
			.catch(respondeWithError('UNKNOWN BUT DANGEROUS ERROR'));
		})
		.catch(respondeWithError('could not delete the folder'));	
	};


	return this;
}


module.exports = FoldersController;
