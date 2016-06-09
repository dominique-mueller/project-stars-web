var logger = require('../adapters/logger.js');
var httpStatus = require('../config.js').httpStatus;
var helpers = require('../helpers/generalHelpers.js');

var LabelsController = function(req, res, authentication){

	var self = this; //@see: adapters/authentication.js 
	this.authentication = authentication;
	var l = require('../modules/label/labels.model.js');
	this.Label = new l();
	var b = require('../modules/bookmark/bookmarks.model.js');
	this.Bookmark = new b(authentication.tokenUserId);
	this.req = req;
	this.res = res;
	this.reqBody;


	//CONSTRUCTOR
	if(req.method != 'GET' && req.method != 'DELETE'){
		this.reqBody = JSON.parse(req.body.data);
	}	


	//#### PRIVATE FUNCTIONS ####

	function removeLabelFromBookmarks(){
		return new Promise(function(resolve, reject){
			bookmarkPromise = Bookmark.findAll().then(function(bookmarks){
				for(var i = 0; i < bookmark.length; i++){
					
				}
			})
			.catch(reject);
		});
	}

	//#### PUBLIC FUNCTIONS ####

	this.get = function(){
		
	};


	this.getAll = function(){
		
	};


	this.post = function(){
		
	};


	this.put = function(){
		
	};


	this.delete = function(){
		
	};


	return this;
}


module.exports = LabelsController;
