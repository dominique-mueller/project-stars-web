var logger = require('../adapters/logger.js');
var httpStatus = require('../config.js').httpStatus;

function BookmarksController(req, res, authentication){

	var self; //@see: adapters/authentication.js 
	this.Bookmark = require('../modules/bookmark/bookmarks.model.js');
	this.req, this.res, this.authentication, this.data;


	//#### PRIVATE FUNCTIONS ####



	//#### PUBLIC FUNCTIONS ####
	this.get = function(){
		var bookmarkPromise = Bookmark.findOne(self.req.params._id, self.authentication.tokenUserId);
		bookmarkPromise.then(function(bookmark){
			res.status(httpStatus.OK).json(bookmark);
			res.end();
		})
		.catch(function(err){
			res.status(httpStatus.BAD_REQUEST).json({error:err});
			res.end();
		});
	}

	this.getAll = function(userFilter){
		var bookmarkPromise = Bookmark.findAll(self.authentication.tokenUserId);
		bookmarkPromise.then(function(bookmarks){
			self.res.status(httpStatus.OK).json({'data':bookmarks});
		})
		.catch(function(err){
			logger.error(err);
			self.res.status(httpStatus.BAD_REQUEST).json({'error':'Failed to get bookmarks.'});
		});
		self.res.end();
	}

	this.post = function(){
		newBookmark.labels = split(self.data.labels, ';');
		var bookmarkPromise = Bookmark.create(newBookmark, self.authentication.tokenUserId);
		bookmarkPromise.then(function(bookmark){
			self.res.status(httpStatus.OK).json({data:bookmark});
		})
		.catch(function(err){
			self.res.status(httpStatus.BAD_REQUEST).json({'error':'Failed to create bookmark.'});
		});
	}

	this.put = function(){
		var bookmarkPromise = Bookmark.update(self.data, self.authentication.tokenUserId);
		bookmarkPromise.then(function(){
			self.res.status(httpStatus.NO_CONTENT);
			self.res.end();
		})
		.catch(function(err){
			self.res.status(httpStatus.BAD_REQUEST).json({'error':err.msg});
		});
	}

	this.delete = function(){
		var bookmarkPromise = Bookmark.delete(self.data._id, self.authentication.tokenUserId);
		bookmarkPromise.then(function(){

		})
		.catch(function(err){
			self.res.status(httpStatus.BAD_REQUEST).json({'error':'Failed to delete bookmark with id ' + });
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
