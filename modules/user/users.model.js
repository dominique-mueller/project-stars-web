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

	find: function(filterCriteria){
		User.find(filterCriteria, function(err, user){

		});
	},

	findOne: function(userId){

	},

	findAll: function(){

	}
}

