var logger = require('../adapters/logger.js');
var httpStatus = require('../config.js').httpStatus;
var helpers = require('../helpers/generalHelpers.js');

var BookmarksController = function(req, res, authentication){

	var self; //@see: adapters/authentication.js 
	this.Bookmark = require('../modules/bookmark/bookmarks.model.js');
	this.Bookmark = new Bookmark(authentication.tokenUserId);
	this.Folder = require('../modules/folder/folders.model.js');
	this.Folder = new Folder(authentication.tokenUserId);
	this.req, this.res, this.authentication, this.reqBod;
	


	//#### PRIVATE FUNCTIONS ####


	//#### PUBLIC FUNCTIONS ####

	// @DEPRECATED
	// this.shiftFoldersPosition = function(path, startPosition, shift){
	// 	logger.debug('Controler shiftFoldersPosition');
	// 	return require('../modules/folder/folders.model.js')(self, authentication.tokenUserId).shiftFoldersPosition(path, startPosition, shift);	
	// }
	// @DEPRECATED
	// this.changeNumberOfContainedElements = function(path, changeBy){
	// 	return require('../modules/folder/folders.model.js')(self, authentication.tokenUserId).changeNumberOfContainedElements(path, changeBy);
	// }
	// @DEPRECATED
	// this.checkIfPathRegardsToOwner = function(path){
	// 	return require('../modules/folder/folders.model.js')(self, authentication.tokenUserId).checkIfPathRegardsToOwner(path);
	// }

	this.get = function(){
		var bookmarkPromise = Bookmark.findOne(self.req.params.bookmark_id);
		bookmarkPromise.then(function(bookmark){
			res.status(httpStatus.OK)
				.json({'data':
					helpers.mongooseObjToFrontEndObj(bookmark)
				}
			);
		})
		.catch(function(err){
			res.status(httpStatus.BAD_REQUEST)
				.json({error:err}
			);
		});
	}

	this.getAll = function(){
		var bookmarkPromise = Bookmark.findAll();
		bookmarkPromise.then(function(bookmarks){
			self.res.status(httpStatus.OK)
				.json({'data':
					helpers.mongooseObjToFrontEndObj(bookmarks)
				}
			);
		})
		.catch(function(err){
			logger.error(err);
			self.res.status(httpStatus.BAD_REQUEST)
				.json({'error':'Failed to get bookmarks.'}
			);
		});
	}

	this.post = function(){
		//TODO Label, check if exist and regard to owner
		var changeNumberOfContaineElementsPromise = Folder.changeNumberOfContainedBookmarks(self.reqBody.path, 1);
		var checkIfPathRegardsToOwnerPromise = Folder.checkIf(self.reqBody.path);
		var bookmarkPromise = Bookmark.create(self.reqBody, [changeNumberOfContaineElementsPromise, checkIfPathRegardsToOwnerPromise]);
		bookmarkPromise.then(function(bookmark){
			self.res.status(httpStatus.OK)
				.json({'data':
					helpers.mongooseObjToFrontEndObj(bookmark)
				}
			);
		})
		.catch(function(err){
			self.res.status(httpStatus.BAD_REQUEST)
				.json({'error':'Failed to create bookmark.'}
			);
		});
	}

	this.put = function(){
		var changeNumberOfContaineElementsPromise = Folder.changeNumberOfContainedBookmarks(self.reqBody.path , 1);
		// var shiftFoldersPositionPromise = Folder.shiftFoldersPosition();
		var bookmarkUpdatePromise = Bookmark.update(self.req.params.bookmark_id, self.reqBody);
		bookmarkUpdatePromise.then(function(){
			self.res.status(httpStatus.NO_CONTENT).end();
		})
		.catch(function(err){
			self.res.status(httpStatus.BAD_REQUEST)
				.json({'error':err}
			);
		});
	}

	this.delete = function(){
		var bookmarkPromise = Bookmark.delete(self.req.params.bookmark_id);
		bookmarkPromise.then(function(){
			self.res.status(httpStatus.NO_CONTENT).end();
		})
		.catch(function(err){
			logger.error(err);
			self.res.status(httpStatus.BAD_REQUEST)
				.json({'error':'Failed to delete bookmark with id ' + self.req.params.bookmark_id}
			);
		});
	}


	//CONSTRUCTOR
	self = this;

	this.req = req;
	this.res = res;
	this.authentication = authentication
	if(req.method != 'GET' && req.method != 'DELETE'){
		this.reqBody = JSON.parse(req.body.data);
	}	

	return this;
}


module.exports = BookmarksController;
