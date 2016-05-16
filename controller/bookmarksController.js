var logger = require('../adapters/logger.js');
var httpStatus = require('../config.js').httpStatus;

var BookmarksController = function(req, res, authentication){

	var self; //@see: adapters/authentication.js 
	this.Bookmark = require('../modules/bookmark/bookmarks.model.js');
	this.Bookmark = new Bookmark(this, authentication.tokenUserId);
	this.req, this.res, this.authentication, this.data;


	//#### PRIVATE FUNCTIONS ####


	//#### PUBLIC FUNCTIONS ####

	this.shiftFoldersPosition = function(path, startPosition, shift){
		logger.debug('Controler shiftFoldersPosition');
		return require('../modules/folder/folders.model.js')(self, authentication.tokenUserId).shiftFoldersPosition(path, startPosition, shift);	
	}

	this.changeNumberOfContainedElements = function(path, changeBy){
		return require('../modules/folder/folders.model.js')(self, authentication.tokenUserId).changeNumberOfContainedElements(path, changeBy);
	}

	this.checkIfPathRegardsToOwner = function(path){
		return require('../modules/folder/folders.model.js')(self, authentication.tokenUserId).checkIfPathRegardsToOwner(path);
	}

	this.get = function(){
		var bookmarkPromise = Bookmark.findOne(self.req.params.bookmark_id);
		bookmarkPromise.then(function(bookmark){
			res.status(httpStatus.OK).json({data:bookmark});
		})
		.catch(function(err){
			res.status(httpStatus.BAD_REQUEST).json({error:err});
		});
	}

	this.getAll = function(){
		var bookmarkPromise = Bookmark.findAll();
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
		//TODO Label control
		var bookmarkPromise = Bookmark.create(self.data);
		bookmarkPromise.then(function(bookmark){
			self.res.status(httpStatus.OK).json({data:bookmark});
		})
		.catch(function(err){
			self.res.status(httpStatus.BAD_REQUEST).json({'error':'Failed to create bookmark.'});
		});
	}

	this.put = function(){
		logger.debug('controller put');
		var bookmarkUpdatePromise = Bookmark.update(self.req.params.bookmark_id, self.data);
		bookmarkUpdatePromise.then(function(){
			self.res.status(httpStatus.NO_CONTENT).end();
		})
		.catch(function(err){
			self.res.status(httpStatus.BAD_REQUEST).json({'error':err});
		});
	}

	this.delete = function(){
		var bookmarkPromise = Bookmark.delete(self.req.params.bookmark_id);
		bookmarkPromise.then(function(){
			self.res.status(httpStatus.NO_CONTENT).end();
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
	if(req.method != 'GET' && req.method != 'DELETE'){
		this.data = JSON.parse(req.body.data);
	}	

	return this;
}


module.exports = BookmarksController;
