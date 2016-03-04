// var mongoose = require('mongoose');
var Label = require('../schemaExport.js').Label;
var logger = require('../../adapters/logger.js');
var errorHandler = require('../../helpers/errorHandler.js');

module.exports = {
	create: function(labelData, userIdPromise) {
		logger.debug('create Label. param labelData:' + labelData.name + '::' + labelData.color + '::'+userId);
		return new Promise(function(resolve, reject){
			userIdPromise.then(function(userId){	
				var label = new Label({
					name: labelData.name,
					color: labelData.color,
					owner: userId,
				});
				label.save(function(err, label){
					if(err){
						logger.debug('failed to create label');
						reject(err);
					}
					else{
						logger.debug('label created: ' + label);
						resolve(label);
					}
				});
			})
			.catch(function(err){
				logger.error("Failed to get userId in label create");
				reject(err);
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
					reject(err);	
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
					reject(err);	
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
					reject(err);
				} 
				else{
					resolve(label);
				}
			});
		});
	},

	findAll: function(userIdPromise){
		logger.debug('findAll labels with userId: ' + userId);
		return new Promise(function(resolve, reject){
			userIdPromise.then(function(userId){	
				Label.find({owner:userId}, function(err, labels){
					if(err){
						reject(err);
					}
					else{
						logger.debug("these labels were found: " + JSON.stringify(labels));
						resolve(labels);
					}
				});
			})
			.catch(function(err){
				logger.error("Failed to get userId in label findAll");
				reject(err);
			});
		});
	}
};

