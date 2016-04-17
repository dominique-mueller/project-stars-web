var logger = require('../adapters/logger.js');
var httpStatus = require('../config.js').httpStatus;


var FoldersController = function(req, res, authentication){

	var self; //@see: adapters/authentication.js 
	this.Folder = require('../modules/folder/folders.model.js');
	this.req, this.res, this.authentication, this.data;

	

	this.get = function(){
		var folderPromise = Folder.findOne(self.req.params.folder_id, self.authentication.tokenUserId);
		folderPromise.then(function(folder){
			res.status(httpStatus.OK).json(folder);
		})
		.catch(function(err){
			res.status(httpStatus.BAD_REQUEST).json({error:err});
		});
	}

	this.getAll = function(){
		var folderPromise = Folder.findAll(self.authentication.tokenUserId);
		folderPromise.then(function(folders){
			self.res.status(httpStatus.OK).json({data:folders});
		})
		.catch(function(err){
			logger.error(err);
			self.req.status(httpStatus.BAD_REQUEST).end();
		});
	}

	this.post = function(){

	}

	this.put = function(){
		var folderUpdatePromise = Folder.update(self.req.params.folder_id, self.data);
		folderUpdatePromise.then(function(){
			self.res.status(httpStatus.NO_CONTENT).end();
		})
		.catch(function(err){
			self.res.status(httpStatus.BAD_REQUEST).json({data:err});
		});


		/*
		changed path:
			decrement the numberOfContainedElements from parent folder
			decrement position of every element with higher position
			change path and position of target
			increment position of every element >= new position of target in new path
			increment numberOfContainedElements in new path 
		change position:

		*/
	}

	this.delete = function(){
		/*
		decrement numberOfContainedElements in path
		decrement position of every element with higher position
		*/
	}



	//CONSTRUCTOR
	self = this;

	this.req = req;
	this.res = res;
	this.authentication = authentication;
	if(req.method != 'GET'){
		this.data = JSON.parse(req.body.data);
	}	

	return this;
}


module.exports = FoldersController;
