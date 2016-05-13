var logger = require('../adapters/logger.js');
var httpStatus = require('../config.js').httpStatus;


var FoldersController = function(req, res, authentication){

	var self; //@see: adapters/authentication.js 
	this.Folder = require('../modules/folder/folders.model.js');
	//TODO remove the first parameter from the Folder.model. 
	//All Promises will be passed as an array to the called function so there won't be a need of a bidirectional communication anymore
	this.Folder = new Folder(this, authentication.tokenUserId);
	this.req, this.res, this.authentication, this.data;

	//#### PRIVATE FUNCTIONS ####



	//#### PUBLIC FUNCTIONS ####
	
	//TODO see this.Folder initialization 
	this.shiftBookmarksPosition = function(path, startPosition, shift){
		return require('../modules/bookmark/bookmarks.model.js')(self, self.authentication.tokenUserId).shiftBookmarksPosition(path, startPosition, shift);	
	}

	this.get = function(){
		var folderPromise = Folder.findOne(self.req.params.folder_id);
		folderPromise.then(function(folder){
			res.status(httpStatus.OK).json({data:folder});
		})
		.catch(function(err){
			res.status(httpStatus.BAD_REQUEST).json({error:err});
		});
	};

	this.getAll = function(){
		var folderPromise = Folder.findAll(null);
		folderPromise.then(function(folders){
			self.res.status(httpStatus.OK).json({data:folders});
		})
		.catch(function(err){
			logger.error(err);
			self.req.status(httpStatus.BAD_REQUEST).end();
		});
	};

	this.post = function(){
		var folderCreatePromise = Folder.create(self.data);
		folderCreatePromise.then(function(folder){
			self.res.status(httpStatus.OK).json({data:folder});
		})
		.catch(function(err){
			self.res.status(httpStatus.BAD_REQUEST).json({'error':err});
		});
	};

	this.put = function(){
		var folderUpdatePromise = Folder.update(self.req.params.folder_id, self.data);
		folderUpdatePromise.then(function(){
			self.res.status(httpStatus.NO_CONTENT).end();
		})
		.catch(function(err){
			self.res.status(httpStatus.BAD_REQUEST).json({'error':err});
		});
	};

	this.delete = function(){
		var deleteFolderPromise = Folder.delete(self.req.params.folder_id);
		//TODO: delete all sub elements
			//find all with path id from this folder
			//iter over search result
				//if bookmark -> delete
				//if folder -> recall this function with subfolder id and delete folder
		deleteFolderPromise.then(function(){
			self.res.status(httpStatus.NO_CONTENT).end();
		})
		.catch(function(err){
			self.res.status(httpStatus.BAD_REQUEST).json({'error':err});
		});
	};



	//CONSTRUCTOR
	self = this;

	this.req = req;
	this.res = res;
	this.authentication = authentication;
	if(req.method != 'GET' && req.method != 'DELETE'){
		this.data = JSON.parse(req.body.data);
	}	
	// try{
	// 	this.data = JSON.parse(req.body.data);
	// }
	// catch(e){
	// 	logger.error('could not parse req.body.data to json');
	// }

	// logger.debug('FoldersController Konstruktor');
	return this;
}


module.exports = FoldersController;
