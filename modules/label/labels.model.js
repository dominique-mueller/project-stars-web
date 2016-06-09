var Label = require('../schemaExport.js').Label;
var logger = require('../../adapters/logger.js');

function LabelsModel(userId){

	var self = this; //@see: adapters/authentication.js 
	this.userId = userId;


	this.create = function(labelData) {
		logger.debug('create Label. param labelData:' + labelData.name + '::' + labelData.color + '::'+self.userId);
		return new Promise(function(resolve, reject){	
			var label = new Label({
				name: labelData.name,
				color: labelData.color,
				owner: self.userId
			});
			console.log("label Object test: " + label._id + "+++"+ label.name);
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
		});
	},

	this.update = function(labelId, labelData){
		logger.debug('update label. param labelData: ' + labelData);
		return new Promise(function(resolve, reject){
			// var labelId = labelData._id; // safe the label id
			// delete labelData._id; //remove the label id from the data set, because it isn't needed
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

	this.delete = function(labelId){
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

	this.findOne = function(labelId){
		logger.debug('findOne label. param labelId: ' + labelId);
		return new Promise(function(resolve, reject){
			Label.findOne({'_id':labelId, 'owner':self.userId}, function(err, label){
				if(err){
					reject(err);
				} 
				else{
					resolve(label);
				}
			});
		});
	},

	this.findAll = function(){
		logger.debug('findAll labels with userId: ' + self.userId);
		return new Promise(function(resolve, reject){
			Label.find({'owner':self.userId}, function(err, labels){
				if(err){
					reject(err);
				}
				else{
					logger.debug("these labels were found: " + JSON.stringify(labels));
					resolve(labels);
				}
			});
		});
	}

	return this;
};

module.exports = LabelsModel;