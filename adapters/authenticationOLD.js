/*
see: https://github.com/scotch-io/node-token-authentication/blob/master/server.js
*/
var jwt = require('jsonwebtoken');
var scrypt = require('scrypt');
var scryptParameters = scrypt.paramsSync(0.1);
var logger = require('./logger');
var secret = require('../config.js').authentication.secret;

// #### Public Functions #### 
module.exports = {
	login: function(payload){
		return new Promise(function(resolve, reject){
			getUser(payload.emailAddress, function(user){
				//TODO: check accountState
					//TODO: reactivate account
				//TODO: create session in db

				if( scrypt.verifyKdfSync(payload.password, user.password) ){
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
		//TODO: delete session in db
	},

	/*
	manages the authentication part of the activation process
	@param: without a parameter the function will generate an activation token
			with the token as parameter the function will verify the token param with a user accountActivation token
	@return: if parameter is set -> return nothing 
			else -> return activation token
			return error if something went wrong
	*/
	activationToken: function(token){
		if(token){
			return;
		}
		else{
			return {token: "DUMMY ACTIVATION TOKEN", tempPassword:"ZERO"};
		}
	},
	
	getUserId: function(token){
		var decodeTokenPromise = decodeToken(token);
		decodeTokenPromise.then(function(decoded){
			return decoded.userId;
		})
		.catch(function(err){
			return err;
		});
	},

	isAdmin: function(token){
		var decodeTokenPromise = decodeToken(token);
		decodeTokenPromise.then(function(decoded){
			return decoded.admin;
		})
		.catch(function(err){
			return err;
		});
	},

	verifyToken: function(token){
		var decodeTokenPromise = decodeToken(token);
		decodeTokenPromise.then(function(decoded){
			console.log('Token: ' + token);
			console.log('verifyToken resolve');
			return true;
		})
		.catch(function(err){
			console.log('Token: ' + token);
			console.log('verifyToken reject');
			return err;
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
			if(pw1 === pw2){
				resolve(scrypt.kdfSync(pw1,scryptParameters));	//resolve with the hashed password (as string)
			}
			else{
				reject(new Error('passwords are not euqal')); 
			}
		});
	},

	/*
	function will generate a secure password
	this function is used when a user is created by an admin or to reset a password
	@return: returns an object with to keys 'password' and 'hash'. 
		The password is the plain newly generated password. The hash is the hashed new password.
	*/
	generatePassword: function(){
		var password = '',
			hash = '',
			charSet = '0987654321poiuztrewqlkjhgfdsamnbvcxyQWERTZUIOPASDFGHJKLYXCVBNM-+/\!?#*§$%&-+/\!?#*§$%&';
		for(i = 0; i < 16; i++){
			password += charSet[Math.floor(Math.random() * charSet.length)]; 
		}
		hash = convertRawPassword(password, password);
		return {'password':password, 'hash': hash};
	}
};


// #### Private Functions ####
function decodeToken(token){
	return new Promise(function(resolve, reject){
		jwt.verify(token, secret, function(err, decoded){
			if(err){
				reject(err);
			}
			else{
				resolve(decoded);
			}
		});
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