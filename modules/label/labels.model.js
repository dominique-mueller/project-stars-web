var mongoose = require('mongoose');
var Label = require('../schemaExport').Label;
var user_id = require('../../adapters/authentication.js').getUser_Id();
var logger = require('../../adapters/logger.js');
var errorHandler = require('../../helpers/errorHandler.js');

module.exports = {
	// create: function(data, response){
	// 	var label = new Label();
	// 	var result;
	// 	logger.debug(data);
	// 	label.name = data.name;
	// 	label.color = data.color;
	// 	label.owner = user_id;
	// 	label.save(function(error, label){
	// 		if(error){
	// 			result = errorHandler.handleMongooseError(error, Label);
	// 		}
	// 		else{
	// 			result = label;
	// 		}
	// 	});
	// 	logger.debug(result);
	// 	response(result);
	// },
	create: function (data) {
		return new Promise(function(resolve, reject){
			var label = new Label();
			logger.debug(data);
			label.name = data.name;
			label.color = data.color;
			label.owner = user_id;
			label.save(function(error, label){
				if(error){
					reject(errorHandler.handleMongooseError(error, Label));
				}
				else{
					resolve(label);
				}
			});
		});
	}
	update: function(data){

	},
	delete: function(data){

	},
	findOne: function(data){

	},
	findAll: function(){
		return new Promise(function(resolve, reject){
			if(true){
				resolve("I PROMISED");
			}
			else{
				reject();
			}
		});
	}
};
