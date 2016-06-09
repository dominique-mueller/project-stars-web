var logger = require('../adapters/logger.js');
var httpStatus = require('../config.js').httpStatus;
var helpers = require('../helpers/generalHelpers.js');

var BookmarksController = function(req, res, authentication){

	var self = this; //@see: adapters/authentication.js 
	this.authentication = authentication;
	var b = require('../modules/bookmark/bookmarks.model.js');
	this.Bookmark = new b(authentication.tokenUserId);
	var f = require('../modules/folder/folders.model.js');
	this.Folder = new f(self.authentication.tokenUserId);
	this.req = req;
	this.res = res;
	this.reqBody;


	//CONSTRUCTOR
	if(req.method != 'GET' && req.method != 'DELETE'){
		this.reqBody = JSON.parse(req.body.data);
	}	


	//#### PRIVATE FUNCTIONS ####

	function manageNumberOfContainedBookmarks(getOldBookmarkPromise){
		var promiseList = new Array();
		getOldBookmarkPromise.then(function(oldBookmark){
			if(self.reqBody.hasOwnProperty('path')){
				promiseList.push(self.Folder.changeNumberOfContainedBookmarks(self.reqBody.path, 1)); //because new bookmark is created
				promiseList.push(self.Folder.changeNumberOfContainedBookmarks(oldBookmark.path, -1)); //because old bookmark is deleted
			}
		})
		.catch(helpers.respondeWithError('failed bookmarksController manageNumberOfContainedBookmarks'));

		return promiseList;
	}
	

	//#### PUBLIC FUNCTIONS ####

	this.get = function(){
		var bookmarkPromise = self.Bookmark.findOne(self.req.params.bookmark_id);
		bookmarkPromise.then(function(bookmark){
			res.status(httpStatus.OK)
			.json({'data':
					helpers.mongooseObjToFrontEndObj(bookmark)
				}
			);
		})
		.catch(function(err){
			res.status(httpStatus.BAD_REQUEST)
			.json({error: err});
		});
	}

	this.getAll = function(){
		var bookmarkPromise = self.Bookmark.findAll();
		bookmarkPromise.then(function(bookmarks){
			logger.debug("bookmarsController getAll successful");
			self.res.status(httpStatus.OK)
			.json({'data':
					helpers.mongooseObjToFrontEndObj(bookmarks)
				}
			);
		})
		.catch(function(err){
			logger.debug("FUCK THIS SHITTY ERROR");
			logger.error(err);
			self.res.status(httpStatus.BAD_REQUEST)
			.json({'error': 'Failed to get bookmarks.'});
		});
	}

	this.post = function(){
		//TODO Label, check if exist and regard to owner
		//TODO checkIfPathRegardsToOwner: Not yet implemented
		// var checkIfPathRegardsToOwnerPromise = Folder.checkIfPathRegardsToOwner(self.reqBody.path);
		var getPositionPromise = self.Folder.changeNumberOfContainedBookmarks(self.reqBody.path, 1);
		getPositionPromise.then(function(position){
			var bookmarkCreatePromise = self.Bookmark.create(self.reqBody, position);
			bookmarkCreatePromise.then(function(bookmark){
				self.res.status(httpStatus.OK)
				.json({'data':
						helpers.mongooseObjToFrontEndObj(bookmark)
					}
				);
			})
			.catch(helpers.respondeWithError("Failed to create bookmark"));
		})
		.catch(helpers.respondeWithError("Failed to create bookmark"));
	}

	this.put = function(){
		var promiseList = new Array();
		// var update = Bookmark.update(self.req.params.bookmark_id, self.reqBody, function(oldBookmark){
		var getOldBookmarkPromise = self.Bookmark.findOne(self.req.params.bookmark_id);
		if(self.reqBody.hasOwnProperty('path') || self.reqBody.hasOwnProperty('position')){
			promiseList.push(self.Bookmark.updateMoveBookmarksFolderOrPosition(self.req.params.bookmark_id, self.reqBody));
			promiseList.concat(manageNumberOfContainedBookmarks(getOldBookmarkPromise));
			Promise.all(promiseList).then(function(){
				self.res.status(httpStatus.NO_CONTENT).end();
			})
			.catch(helpers.respondeWithError("Failed to update bookmark"));
		}
		else{
			var updateBookmarkEditablesPromise = self.Bookmark.updateBookmarkEditables(self.req.params.bookmark_id, self.reqBody);
			updateBookmarkEditablesPromise.then(function(){
				self.res.status(httpStatus.NO_CONTENT).end();
			})
			.catch(helpers.respondeWithError("Failed to update bookmark"));
		}
	}

	this.delete = function(){
		// var shiftFoldersPromise = shiftFoldersPosition(bookmark.path, bookmark.position, -1);
		var deletePromise = self.Bookmark.delete(self.req.params.bookmark_id);
		deletePromise.then(function(bookmark){
			var changeNumberOfContainedElementsPromise = self.Folder.changeNumberOfContainedBookmarks(bookmark.path, -1);
			changeNumberOfContainedElementsPromise.then(function(){
				self.res.status(httpStatus.NO_CONTENT).end();
			})
			//Todo rollback
			.catch(helpers.respondeWithError('Failed to dekrement number of contained bookmarks in path folder'));	
		})
		//Todo rollback
		.catch(helpers.respondeWithError('Failed to delete bookmark with id ' + self.req.params.bookmark_id));
	}

	return this;
}


module.exports = BookmarksController;
