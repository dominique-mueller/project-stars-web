var logger = require('../adapters/logger.js');
var httpStatus = require('../config.js').httpStatus;

var DevicesController = function(req, res, authentication){

	var self; //@see: adapters/authentication.js 
	this.Device = require('../modules/device/devices.model.js');
	this.Device = new Device(authentication.tokenUserId);
	this.req, this.res, this.authentication, this.data;


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


module.exports = DevicesController;