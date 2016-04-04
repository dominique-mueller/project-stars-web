var User = require('../schemaExport.js').User;
var logger = require('../../adapters/logger.js');


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
					logger.debug('failed to update user');
					reject(err);	
				}
				else{
					logger.debug('user updated');
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

	findOne: function(userId){
		var promise = new Promsie(function(resolve, reject){
			logger.debug('IN this Promise');
			User.findById(userId, function(err, user){
				if(err){
					reject(err);
				} 
				else{
					resolve(user);
				}
			});
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

