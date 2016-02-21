var mongoose = require('mongoose');
var Label = require('../schemaExport').Label;
var user_id = require('../../adapters/authentication.js').getUser_Id();
var logger = require('../../adapters/logger.js');
var errorHandler = require('../../helpers/errorHandler.js');

module.exports = {
	create: function(labelData) {
		logger.debug('create Label. param labelData:' + labelData);
		return new Promise(function(resolve, reject){
			var label = new Label();
			logger.debug(data);
			label.name = data.name;
			label.color = data.color;
			label.owner = user_id;
			label.save(function(err, label){
				if(err){
					logger.debug('failed to create label');
					reject(errorHandler.handleMongooseError(err, Label));
				}
				else{
					logger.debug('label created: ' + label);
					resolve(label);
				}
			});
		});
	},

	update: function(labelData){
		logger.debug('update label. param labelData: ' + labelData);
		return new Promise(function(resolve, reject){
			var labelId = labelData.id; // safe the label id
			delete labelData.id; //remove the label id from the data set, because it isn't needed
			Label.findByIdAndUpdate(labelId, labelData, {new:true}, function(err){
				if(err){
					logger.debug('failed to update label');
					reject(errorHandler.handleMongooseError(err, Label));	
				}
				else{
					logger.debug('label updated');
					resolve();
				}
			});
		});
	},

	delete: function(labelId){
		logger.debug('delete label. param labelId: ' + labelId);
		return new Promise(function(resolve, reject){
			Label.findByIdAndRemove(labelId, function(err){
				if(err){
					reject(errorHandler.handleMongooseError(err, Label));	
				}
				else{
					resolve();
				}
			});
		});
	},

	findOne: function(labelId){
		logger.debug('findOne label. param labelId: ' + labelId);
		return new Promise(function(resolve, reject){
			Label.findById(labelId, function(err, label){
				if(err){
					reject(errorHandler.handleMongooseError(err, Label));
				} 
				else{
					resolve(label);
				}
			});
		});
	},

	findAll: function(userId){
		logger.debug('findAll labels');
		return new Promise(function(resolve, reject){
			Label.find({}, function(err, labels){
				if(err){
					reject(errorHandler.handleMongooseError(err, Label));
				}
				else{
					resolve(labels);
				}
			});
		});
	}
};

