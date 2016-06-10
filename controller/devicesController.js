var logger = require('../adapters/logger.js');
var httpStatus = require('../config.js').httpStatus;
var helpers = require('../helpers/generalHelpers.js');

var DevicesController = function(req, res, authentication){

	var self = this; //@see: adapters/authentication.js 
	this.authentication = authentication
	var d = require('../modules/device/devices.model.js');
	this.Device = new d(authentication.tokenUserId);
	this.req = req, this.res = res, this.reqBody;
	

	//CONSTRUCTOR
	if(req.method != 'GET' && req.method != 'DELETE'){
		// this.reqBody = JSON.parse(req.body.data);
		this.reqBody = req.body.data;
	}	


	//#### PRIVATE FUNCTIONS ####


	//#### PUBLIC FUNCTIONS ####

	this.post = function(){

	}

	this.put = function(){

	}

	this.delete = function(){

	}

	this.getAll = function(){

	}

	this.getOne = function(){
		
	}



	return this;
}


module.exports = DevicesController;