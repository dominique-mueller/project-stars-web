var mongoose = require('mongoose');
var passwordHash = require('password-hash');

/* 	@param data: all the data required to create a new user in js object structure
	@return: function returns a new object from type user
*/
function create(data){
	// var user = new mongoose.model('User');
	// user.firstName = data.firstName;
	// user.lastName = data.lastName;
	// user.emailAddress = data.emailAddress;
	// //validate password length before hashing
	// if(!(data.password.length < 8 || data.password.length > 32)){
	// 	user.password = passwordHash.generate(data.password);
	// }
	// else{
	// 	//TODO throw validation error
	// }

	// user.save(function(err, ){

	// });

	return user;
}

function update(data){

}

function delete(data){

}

function find(data){
	// if(!data){ 	//if there are no data as param the function will behave like findAll()
	// 	return findAll();
	// }
}

function findOne(data){

}

function findAll(data){

}

