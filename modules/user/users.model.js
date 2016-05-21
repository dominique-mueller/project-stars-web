var User = require('../schemaExport.js').User;
var logger = require('../../adapters/logger.js');

var UsersModel = function(caller, userId){

	var self; //@see:authentication adapter
	this.userId;

	//#### PRIVATE FUNCTIONS ####

		// var fullFillPromise = function(){
		// 	return function(err, result){
		// 		logger.debug('fullFillPromise');
		// 		if(err){
		// 			reject(err);
		// 		}
		// 		else{
		// 			logger.debug('fullFillPromise RESOLVED::' + result);
		// 			resolve(result);
		// 		}
		// 	};
		// };

	//#### PUBLIC FUNCTIONS ####
	
	//create expects that the userData can allreay be used as direct input parameter
	this.create = function(userData){
		logger.debug("Create the User");
		return new Promise(function(resolve, reject){
			var user = new User(userData);
			user.save(function(err, user){
				if(err){
					reject(err);
				}
				else{
					resolve(user);
				}
			});
		});
	}

	this.update = function(userId, userData){
		// logger.debug('UPDATE USER_ID::' + userId + " :: USER_DATA:: " + userData);
		return new Promise(function(resolve, reject){
			User.findByIdAndUpdate(userId, userData, {new:true}, function(err){
				if(err){
					reject(err);
				}
				else{
					resolve();
				}
			});
		});
	},

	this.delete = function(userId){
		return new Promise(function(resolve, reject){
			User.findByIdAndRemove(userId, function(err){
				if(err){
					reject(err);
				}
				else{
					resolve();
				}
			});
		});
	}

	this.deactivate = function(userId){

	}

	this.find = function(filterCriteria){
		return new Promise(function(resolve, reject){
			User.find(filterCriteria, function(err, users){
				if(err){
					reject(err);
				}
				else{
					resolve(users);
				}
			});
		});
	}

	this.findOne = function(identifier){
		//TODO rewrite so there are two inner functions to use
		var regex = new RegExp(/^\d+$/);
		logger.debug('REGEX RESULT::'+regex.test(parseInt(identifier)));
		var promise = new Promise(function(resolve, reject){
			// resolve = res;
			// reject = rej;
			if(regex.test(parseInt(identifier))){ //check if identifier is an id (only numbers) or an email-address
				logger.debug('find user by id');
				User.findById(identifier, 
					function(err, result){
					if(err){
						logger.debug('fullFillPromise REJECTED');
						reject(err);
					}
					else{
						resolve(result);
					}}
					// new fullFillPromise()
				);
			}
			else{
				logger.debug('find user by email');
				User.findOne({emailAddress:identifier}, 
					function(err,result){
					if(err){
						logger.debug('fullFillPromise REJECTED');
						reject(err);
					}
					else{
						resolve(result);
					}}
					// new fullFillPromise()
				);
			}
		});
		return promise;
	}

	this.findAll = function(){
		return new Promise(function(resolve, reject){
			User.find({}, function(err, users){
				if(err){
					reject(err);
				}
				else{
					resolve(users);
				}
			});
		});
	}

	self = this;
	this.userId = userId;

	return this;
}

module.exports = UsersModel;
