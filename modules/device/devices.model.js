var Device = require('../schemaExport.js').Device;
var logger = require('../../adapters/logger.js');


function DeviceModel(userId){
	
	var self; //@see: adapters/authentication.js 
	this.userId;

	//#### Private Functions ####


	//#### Public Functions ####

	this.create = function(deviceData){
		
	}

	this.update = function(deviceId, deviceData){

	}

	this.delete = function(deviceId){

	}

	this.find = function(data){
		
	}

	this.findOne = function(data){

	}

	this.findAll = function(data){

	}


	self = this;
	this.userId = userId;

	return this;
}

module.exports = BookmarksModel;