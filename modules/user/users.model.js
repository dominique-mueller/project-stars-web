var User = require('../schemaExport.js').User;


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

	update: function(userData){
		var userId = userData._id; // safe the user id
		delete userData._id; //remove the user id from the data set, because it isn't needed
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
		return new Promsie(function(resolve, reject){
			User.findById(userId, function(err, user){
				if(err){
					reject(err);
				} 
				else{
					resolve(user);
				}
			});
		});
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

