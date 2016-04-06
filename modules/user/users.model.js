var User = require('../schemaExport.js').User;
var logger = require('../../adapters/logger.js');

function fullFillPromise(resolve, reject, err, result){
	logger.debug('fullFillPromise');
	if(err){
		reject(err);
	}
	else{
		logger.debug('fullFillPromise REJECTED');
		resolve(result);
	}
};


module.exports = {
	//create expects that the userData can allreay be used as direct input parameter
	create: function(userData){
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
	},

	update: function(userId, userData){
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

	delete: function(userId){
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
	},

	deactivate: function(userId){

	},

	find: function(filterCriteria){
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
	},

	findOne: function(identifier){
		var regex = new RegExp(/^\d+$/);
		logger.debug('REGEX RESULT::'+regex.test(identifier));
		var promise = new Promise(function(resolve, reject){
			if(regex.test(identifier)){ //check if identifier is an id (only numbers) or an email-address
				logger.debug('find user by id');
				User.findById(identifier, 
					function(err, result){
					if(err){
						reject(err);
					}
					else{
						logger.debug('fullFillPromise REJECTED');
						resolve(result);
					}}
					// fullFillPromise(resolve, reject, err, user)
				);
			}
			else{
				logger.debug('find user by email');
				User.findOne({emailAddress:identifier}, 
					function(err,result){
					if(err){
						reject(err);
					}
					else{
						logger.debug('fullFillPromise REJECTED');
						resolve(result);
					}}
					// fullFillPromise(resolve, reject, err, user)
				);
			}
		});
		return promise;
	},

	findAll: function(){
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
}
