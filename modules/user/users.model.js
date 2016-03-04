var User = require('../schemaExport.js').User;


module.exports = {
	create: function(userData){
		return new Promise(function(resolve, reject){
			var user = new User({
				firstName = userData.firstName,
				lastName = userData.lastName,
				emailAddress = userData.emailAddress,
				password = userData.password,
				profileImage = userData.profileImage,
			});
		});
	},

	update: function(userData){
		var userId = userData.id; // safe the label id
		delete userData.id; //remove the user id from the data set, because it isn't needed
	},

	delete: function(userId){

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

