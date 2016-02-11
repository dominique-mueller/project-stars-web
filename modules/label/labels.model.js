var mongoose = require('mongoose');
var Label = require('../schemaExport').Label;
var user_id = require('../../adapters/authentication.js').getUser_Id();
var logger = require('../../adapters/logger.js');
var errorHandler = require('../../helpers/errorHandler.js');

module.exports = {
	create: function(data, response){
		var label = new Label();
		var result;
		label.name = data.name;
		label.owner = user_id;
		label.save(function(error, label){
			if(error){
				result = errorHandler.handleMongooseError(error, Label);
			}
			else{
				result = label;
			}
		});
		response(result);
	},
	update: function(data){

	},
	delete: function(data){

	},
	findOne: function(data){

	},
	findAll: function(response){
		response('hi');
	}
};
