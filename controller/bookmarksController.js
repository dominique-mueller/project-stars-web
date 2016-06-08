var logger = require('../adapters/logger.js');
var httpStatus = require('../config.js').httpStatus;
var helpers = require('../helpers/generalHelpers.js');

var BookmarksController = function(req, res, authentication){

	var self = this; //@see: adapters/authentication.js 
	this.authentication = authentication;
	this.Bookmark = require('../modules/bookmark/bookmarks.model.js');
	this.Bookmark = new Bookmark(authentication.tokenUserId);
	this.Folder = require('../modules/folder/folders.model.js');
	this.Folder = new Folder(self.authentication.tokenUserId);
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
				promiseList.push(Folder.changeNumberOfContainedBookmarks(self.reqBody.path, 1)); //because new bookmark is created
				promiseList.push(Folder.changeNumberOfContainedBookmarks(oldBookmark.path, -1)); //because old bookmark is deleted
			}
		})
		.catch(function(){console.log("CATCH OF bookmark controller put");});

		return promiseList;
	}
	

	//#### PUBLIC FUNCTIONS ####

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
			.json({error: err});
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
			.json({'error': 'Failed to get bookmarks.'});
		});
	}

	this.post = function(){
		//TODO Label, check if exist and regard to owner
		//TODO checkIfPathRegardsToOwner: Not yet implemented
		// var checkIfPathRegardsToOwnerPromise = Folder.checkIfPathRegardsToOwner(self.reqBody.path);
		var getPositionPromise = Folder.changeNumberOfContainedBookmarks(self.reqBody.path, 1);
		getPositionPromise.then(function(position){
			var bookmarkCreatePromise = Bookmark.create(self.reqBody, position);
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
		var getOldBookmarkPromise = Bookmark.findOne(self.req.params.bookmark_id);
		if(self.reqBody.hasOwnProperty('path') || self.reqBody.hasOwnProperty('position')){
			promiseList.push(Bookmark.updateMoveBookmarksFolderOrPosition(self.req.params.bookmark_id, self.reqBody));
			promiseList.concat(manageNumberOfContainedBookmarks(getOldBookmarkPromise));
			Promise.all(promiseList).then(function(){
				self.res.status(httpStatus.NO_CONTENT).end();
				// .json({'data':
				// 	helpers.mongooseObjToFrontEndObj(results[0])
				// });
			})
			.catch(helpers.respondeWithError("Failed to update bookmark"));
		}
		else{
			var updateBookmarkEditablesPromise = Bookmark.updateBookmarkEditables(self.req.params.bookmark_id, self.reqBody);
			updateBookmarkEditablesPromise.then(function(){
				self.res.status(httpStatus.NO_CONTENT).end();
			})
			.catch(helpers.respondeWithError("Failed to update bookmark"));
		}
	}

	this.delete = function(){
		// var shiftFoldersPromise = shiftFoldersPosition(bookmark.path, bookmark.position, -1);
		var deletePromise = Bookmark.delete(self.req.params.bookmark_id);
		deletePromise.then(function(bookmark){
			var changeNumberOfContainedElementsPromise = Folder.changeNumberOfContainedBookmarks(bookmark.path, -1);
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
