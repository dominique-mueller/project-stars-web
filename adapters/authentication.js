/*
see: https://github.com/scotch-io/node-token-authentication/blob/master/server.js
*/
var jwt = require('jsonwebtoken');
var passwordHash = require('password-hash');
var logger = require('./logger');
var secret = require('../config.js').authentication.secret;

// var test = "56cae3af006e62de458f957d";

// #### Public Functions #### 
module.exports = {
	login: function(payload){
		return new Promise(function(resolve, reject){
			getUser(payload.emailAddress, function(user){
				if(passwordHash.verify(payload.password, user.password)){
					resolve(jwt.sign({
						userId: user._id,
						admin: user.admin
					}, secret,{expiresIn: 1440}));
				}
				else{
					reject(new Error('Could not create token. Wrong Password'));
				}
			});	
		});
	},
	
	logout: function(payload){

	},
	
	getUserId: function(token){
		return new Promise(function(resolve, reject){
			jwt.verify(token, secret, function(err, decoded){
				if(err){
					reject(err);
				}
				else{
					resolve(decoded.userId);
				}
			});
		});
	},

	/*
	function will compare the two input parameters whether they are equal or not. 
	@param: takes to parameters. both parameters are the password the proceed. 
	@return: returns a promise. the resolve's param is a hashed password with a salt in form algorithm$salt$hash. 
			if params are not equal, the promise will reject with the Error message 'passwords are not equal'
	*/
	convertRawPassword: function(pw1, pw2){
		return new Promise(function(resolve, reject){
			if(pw1 == pw2){
				resolve(passwordHash.generate(pw1));	//resolve with the hashed password
			}
			else{
				reject(new Error('passwords are not euqal')); 
			}
		});
	}
};


// #### Private Functions ####
function getUser(emailAddress, callback){
	var result = require('..\modules\user\users.module.js').find({'emailAddress':emailAddress});
	result.then(function(user){
		callback(user);
	})
	.catch(function(){
		callback(new Error("could not find user by emailAddress"));
	});
}