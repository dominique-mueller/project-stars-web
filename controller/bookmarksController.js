var logger = require('../adapters/logger.js');
var httpStatus = require('../config.js').httpStatus;

var BookmarksController = function(req, res, authentication){

	var self; //@see: adapters/authentication.js 
	this.Bookmark = require('../modules/bookmark/bookmarks.model.js');
	this.req, this.res, this.authentication, this.data;


	//#### PRIVATE FUNCTIONS ####

	function bringBookmarksInNewOrder(bookmark){
		var allInFolderPromise = Bookmark.findAllInFolder(bookmark.path, self.authentication.tokenUserId);
		if(self.data.position < bookmark.position){
			allInFolderPromise.then(moveBookmarkUp);
		}
		else if(self.data.position > bookmark.position){
			allInFolderPromise.then(moveBookmarkDown);
		}
		else{
			self.res.status(httpStatus.INVALID_INPUT).end();
		}
		allInFolderPromise.then(function(allInFolderArray){
			for(var i = self.data.position; i < allInFolderArray.length; i++){
				if(allInFolderArray[i].position < self.data.position){

				}
				else if(allInFolderArray[i].position > self.data.position){}
			}
		});
		
		function moveBookmarkUp(allInFolderArray){
			var i;
			for(i = self.data.position; i < bookmark.position; i++){
				allInFolderArray[i].position = allInFolderArray[i].position + 1;
			}
			i++;
			allInFolderArray[i].position = self.data.position;
			saveNewBookmarkOrder(allInFolderArray, [self.data.position, i]);
		}

		function moveBookmarkDown(allInFolderArray){
			for(i = bookmark.position + 1; i <= self.data.position; i++){
				allInFolderArray[i].position = allInFolderArray[i].position - 1;
			}
			i++;
			allInFolderArray[bookmark.position].position = self.data.position
			saveNewBookmarkOrder(allInFolderArray, [bookmark.position, i]);
		}

		/*@param indexBorders: Array with two fields. 
			Field one gives the lower index, where the altered bookmarks in the allInFolderArray start
			Field two gives the upper index, where the altered bookmarks in the allInFolderArray end 
		*/
		function saveNewBookmarkOrder(allInFolderArray, indexBorders){

		}

		function getPositionForNewBookmark(folderId){
			var folderPromise = require('../modules/folder/folders.model.js').findOne(folderId);
		}
	}


	//#### PUBLIC FUNCTIONS ####
	this.get = function(){
		var bookmarkPromise = Bookmark.findOne(self.req.params.bookmark_id, self.authentication.tokenUserId);
		bookmarkPromise.then(function(bookmark){
			res.status(httpStatus.OK).json({data:bookmark});
			res.end();
		})
		.catch(function(err){
			res.status(httpStatus.BAD_REQUEST).json({error:err});
			res.end();
		});
	}

	this.getAll = function(){
		var bookmarkPromise = Bookmark.findAll(self.authentication.tokenUserId);
		bookmarkPromise.then(function(bookmarks){
			self.res.status(httpStatus.OK).json({'data':bookmarks});
		})
		.catch(function(err){
			logger.error(err);
			self.res.status(httpStatus.BAD_REQUEST).json({'error':'Failed to get bookmarks.'});
		});
	}

	this.post = function(){
		// self.data.labels = split(self.data.labels, ';');
		var bookmarkPromise = Bookmark.create(self.data, self.authentication.tokenUserId);
		bookmarkPromise.then(function(bookmark){
			self.res.status(httpStatus.OK).json({data:bookmark});
		})
		.catch(function(err){
			self.res.status(httpStatus.BAD_REQUEST).json({'error':'Failed to create bookmark.'});
		});
	}

	this.put = function(){
		logger.debug('Bookmark Put');
		var bookmarkPromise;
		if(self.data.hasOwnProperty('position')){
			bookmarkPromise = Bookmark.findOne(self.req.params.bookmark_id, self.authentication.tokenUserId);
			bookmarkPromise.then(bringBookmarksInNewOrder);
			// bring them in new order
			// save all of them
		}
		else{
			bookmarkPromise = Bookmark.update(self.req.params.bookmark_id, self.data, self.authentication.tokenUserId);
			bookmarkPromise.then(function(){
				self.res.status(httpStatus.NO_CONTENT);
				self.res.end();
			})
			.catch(function(err){
				self.res.status(httpStatus.BAD_REQUEST).json({'error':err});
			});
		}
	}

	this.delete = function(){
		var bookmarkPromise = Bookmark.delete(self.req.params.bookmark_id, self.authentication.tokenUserId);
		bookmarkPromise.then(function(){

		})
		.catch(function(err){
			self.res.status(httpStatus.BAD_REQUEST).json({'error':'Failed to delete bookmark with id ' + self.req.params.bookmark_id});
		});
	}


	//CONSTRUCTOR
	self = this;

	this.req = req;
	this.res = res;
	this.authentication = authentication
	if(req.method != 'GET'){
		this.data = JSON.parse(req.body.data);
	}	

	return this;
}


module.exports = BookmarksController;
