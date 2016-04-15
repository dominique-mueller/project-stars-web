var logger = require('../adapters/logger.js');
var httpStatus = require('../config.js').httpStatus;


var FoldersController = function(){

	var self; //@see: adapters/authentication.js 
	this.Folder = require('../modules/folder/folders.model.js');
	this.req, this.res, this.authentication, this.data;

	

	this.get = function(){
		var folderPromise = Folder.findOne(self.req.params._id, self.authentication.tokenUserId);
		folderPromise.then(function(folder){
			res.status(httpStatus.OK).json(folder);
			res.end();
		})
		.catch(function(err){
			res.status(httpStatus.BAD_REQUEST).json({error:err});
			res.end();
		});
	}

	this.getAll = function(){

	}

	this.post = function(){

	}

	this.put = function(){

	}

	this.delete = function(){

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


module.exports = FoldersController;
