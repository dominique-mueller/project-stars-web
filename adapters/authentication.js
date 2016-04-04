/*
see: https://github.com/scotch-io/node-token-authentication/blob/master/server.js
*/
var jwt = require('jsonwebtoken');
var scrypt = require('scrypt');
var scryptParameters = scrypt.paramsSync(0.1);
var logger = require('./logger');
var secret = require('../config.js').authentication.secret;


function Authentication(token){
	
	var self; 
	/*workaround for an ECMA bug in the scope of the 'this' propertie. 
	The nameing comes from the python programming language and refers to the 'class' and all class attributes and functions. 
	variable is set in the constructor (end of function)*/
	this.token = null;
	this.tokenUserId = null;
	this.isAdmin = null; 

	//#### PRIVATE FUNCTIONS ####

	function decodeToken(token, callback){
		jwt.verify(token, secret, function(err, decoded){
			if(err){
				callback(err, null);
			}
			else{
				callback(null, decoded);
			}
		});
	}

	function getUser(emailAddress, callback){
		var result = require('../modules/user/users.model.js').find({'emailAddress':emailAddress});
		result.then(function(user){
			callback(user);
		})
		.catch(function(){
			callback(new Error("could not find user by emailAddress"));
		});
	}

	//#### PUBLIC FUNCTIONS ####

	this.login = function(data){
		return new Promise(function(resolve, reject){
			getUser(data.emailAddress, function(user){
				//TODO: check accountState
					//TODO: reactivate account
				//TODO: create session in db

				if( scrypt.verifyKdfSync(data.password, user.password) ){
					resolve(jwt.sign({
						iss: 'stars-web.de',
						userId: user._id,
						admin: user.admin
					}, secret,{expiresIn: 1440}));
				}
				else{
					reject(new Error('Could not create token. Wrong Password'));
				}
			});	
		});
	}

	this.logout = function(payload){
			//TODO: delete session in db
	}

	/*
	manages the authentication part of the activation process
	@param: without a parameter the function will generate an activation token
			with the token as parameter the function will verify the token param with a user accountActivation token
	@return: if parameter is set -> return nothing 
			else -> return activation token
			return error if something went wrong
	*/
	this.activationToken = function(token){
		if(token){
			return;
		}
		else{
			return {token: "DUMMY ACTIVATION TOKEN", tempPassword:"ZERO"};
		}
	}

	

	// // function will compare the two input parameters whether they are equal or not. 
	// // @param: takes to parameters. both parameters are the password the proceed. 
	// // @return: returns a promise. the resolve's param is a hashed password with a salt in form algorithm$salt$hash. 
	// // 		if params are not equal, the promise will reject with the Error message 'passwords are not equal'
	
	// this.convertRawPassword = function(pw1, pw2){
	// 	return new Promise(function(resolve, reject){
	// 		if(pw1 === pw2){
	// 			resolve(scrypt.kdfSync(pw1,scryptParameters));	//resolve with the hashed password (as string)
	// 		}
	// 		else{
	// 			reject(new Error('passwords are not euqal')); 
	// 		}
	// 	});
	// }

	/*
	@return: hashed password (input param) in form: algorithm$salt$hash
	*/
	this.convertRawPassword = function(password){
		try{
			var hash = scrypt.kdfSync(password, scryptParameters);
			return hash;
		}
		catch(e){
			return new Error('failed to convert the password');
		}
	}

	/*
	function will generate a secure password
	this function is used when a user is created by an admin or to reset a password
	@return: returns an object with to keys 'password' and 'hash'. 
		The password is the plain newly generated password. The hash is the hashed new password.
	*/
	this.generatePassword = function(){
		var password = '',
			hash = '',
			charSet = '0987654321poiuztrewqlkjhgfdsamnbvcxyQWERTZUIOPASDFGHJKLYXCVBNM-+/\!?#*§$%&-+/\!?#*§$%&';
		for(i = 0; i < 16; i++){
			password += charSet[Math.floor(Math.random() * charSet.length)]; 
		}
		hash = convertRawPassword(password, password);
		return {'password':password, 'hash': hash};
	}

	this.setToken = function(token, callback){
		self.token = token;
		decodeToken(token, function(err, result){
			if(err){
				logger.error(err);
				callback(err);
			}
			else{
				self.tokenUserId = result.userId;
				self.isAdmin = result.admin;
				callback(null);
			}
		});
	}


	//#### CONSTRUCTOR ####
	self = this;
	if(token){
		this.setToken(token, function(err){
			if(err){

			}
		});
	}
	else{

	}
	
	return this;
}

module.exports = Authentication;