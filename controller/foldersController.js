var logger = require('../adapters/logger.js');
var httpStatus = require('../config.js').httpStatus;
var helpers = require('../helpers/generalHelpers.js');

var FoldersController = function(req, res, authentication){

	var self; //@see: adapters/authentication.js 
	this.Folder = require('../modules/folder/folders.model.js');
	//TODO remove the first parameter from the Folder.model. 
	//All Promises will be passed as an array to the called function so there won't be a need of a bidirectional communication anymore
	this.Folder = new Folder(this, authentication.tokenUserId);
	this.req, this.res, this.authentication, this.reqBody;

	//#### PRIVATE FUNCTIONS ####

	function deleteSubFolders(pathId){
		logger.debug('deleteSubFolders: ' + pathId);
		return new Promise(function(resolve, reject){
			var findSubFolderPromise = Folder.findAll(pathId);
			findSubFolderPromise.then(function(folders){
				var deletePromises = new Array();
				for(var i = 0; i < folders.length; i++){
					logger.debug('Delete Subfolder with the Id:' + folders[i]._id);
					deletePromises.push(self.recursiveDelete(folders[i]._id));
				}
				Promise.all(deletePromises).then(function(){
					resolve();
				})
				.catch(reject);
			})
			.catch(reject);
		});	
	}

	function deleteSubBookmarks(pathId){
		logger.debug('deleteSubBookmarks: ' + pathId);
		return new Promise(function(ersolve, reject){
			var findSubBookmarksPromise = require('../modules/bookmark/bookmarks.model.js')(self, authentication.tokenUserId).findAll(pathId);
			findSubBookmarksPromise.then(function(bookmarks){
				var deletePromises = new Array();
				for(var i = 0; i < bookmarks.length; i++){
					logger.debug('Delete Subbookmark with the Id:' + bookmarks[i]._id);
					deletePromises.push(require('../modules/bookmark/bookmarks.model.js')(self, authentication.tokenUserId).delete(bookmarks[i]._id));
				}
				Promise.all(deletePromises).then(function(){
					resolve();
				})
				.catch(reject);
			})
			.catch(reject);
		});
	}

	function recursiveDelete(folderId){
		var deleteFolderPromise = Folder.delete(self.req.params.folder_id);
		var deleteSubFolderPromise = deleteSubFolders(folderId);
		var deleteSubBookmarksPromise = deleteSubBookmarks(folderId);
		return new Promise(function(resolve, reject){
			Promise.all([deleteFolderPromise, deleteSubFolderPromise, deleteSubBookmarksPromise]).then(function(){
				resolve();
			})
			.catch(reject);
		});
	}

	//#### PUBLIC FUNCTIONS ####
	
	//TODO see this.Folder initialization 
	this.shiftBookmarksPosition = function(path, startPosition, shift){
		return require('../modules/bookmark/bookmarks.model.js')(self, self.authentication.tokenUserId).shiftBookmarksPosition(path, startPosition, shift);	
	}

	this.get = function(){
		var folderPromise = Folder.findOne(self.req.params.folder_id);
		folderPromise.then(function(folder){
			res.status(httpStatus.OK)
				.json({'data':
					helpers.mongooseObjToFrontEndObj(folder)
				}
			);
		})
		.catch(function(err){
			res.status(httpStatus.BAD_REQUEST)
				.json({error:err}
			);
		});
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
		.catch(function(err){
			logger.error(err);
			self.req.status(httpStatus.BAD_REQUEST).end();
		});
	};

	this.post = function(){
		//TODO: use isRoot field instead of owner == path for the root folder
		var folderCreatePromise = Folder.create(self.reqBody);
		folderCreatePromise.then(function(folder){
			self.res.status(httpStatus.OK)
				.json({data:folder}
			);
		})
		.catch(function(err){
			self.res.status(httpStatus.BAD_REQUEST)
				.json({'error':err}
			);
		});
	};

	this.put = function(){
		var folderUpdatePromise = Folder.update(self.req.params.folder_id, self.reqBody);
		folderUpdatePromise.then(function(){
			self.res.status(httpStatus.NO_CONTENT).end();
		})
		.catch(function(err){
			self.res.status(httpStatus.BAD_REQUEST)
				.json({'error':err}
			);
		});
	};

	this.delete = function(folderId){
		var deleteFolderPromise = Folder.delete(self.req.params.folder_id);
		var deleteSubFolderPromise = deleteSubFolders(self.req.params.folder_id);
		var deleteSubBookmarksPromise = deleteSubBookmarks(self.req.params.folder_id);
		Promise.all([deleteFolderPromise, deleteSubFolderPromise, deleteSubBookmarksPromise]).then(function(){
			self.res.status(httpStatus.NO_CONTENT).end();
		})
		.catch(function(err){
			self.res.status(httpStatus.BAD_REQUEST)
				.json({'error':err}
			);	
		});	
	};



	//CONSTRUCTOR
	self = this;

	this.req = req;
	this.res = res;
	this.authentication = authentication;
	if(req.method != 'GET' && req.method != 'DELETE'){
		this.reqBody = JSON.parse(req.body.data);
	}	

	return this;
}


module.exports = FoldersController;
