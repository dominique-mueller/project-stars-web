var logger = require('../adapters/logger.js');
var httpStatus = require('../config.js').httpStatus;
// var eMail = require('./eMail'); 	//reminder for later development with e-mail adapter

function UsersController(req, res, authentication){
	
	var self; //@see: adapters/authentication.js 
	this.User = require('../modules/user/users.model.js');
	this.req, this.res, this.authentication, this.data;

	//#### PRIVATE FUNCTIONS ####

	function getOne(userId){
		logger.debug('getOne!!');
		var userPromise = self.User.findOne(userId);
		userPromise.then(function(user){
		 	logger.debug('userPromise then');
		 	self.res.status(httpStatus.OK).json(user);
		})
		.catch(function(err){
			logger.error(err);
			self.res.status(httpStatus.BAD_REQUEST).json({'error':err});
		});
	}
	
	function deactivate(){

	}

	function createNewUserAccount(newUserData){
		mongooseUserObject = {
			firstName: newUserData.firstName, 
			lastName: newUserData.lastName,
			emailAddress: newUserData.emailAddress,
			password: self.authentication.convertRawPassword(newUserData.password),
			accountActivation: self.authentication.activationToken()
		};
		var userCreatePromise = self.User.create(mongooseUserObject);
		userCreatePromise.then(function(newUser){
			tokenPromise = self.authentication.login();
			//TODO login 
			/* TODO
			account activation
			send mail with activation link
			*/
			self.res.status(httpStatus.OK).json({'data':newUser});
			self.res.end();
		})
		.catch(function(err){
			logger.error(err);
			//TODO: check for unique error.
			self.res.status(httpStatus.BAD_REQUEST).json({'error':err});
			self.res.end();
		});
	}

	function adminCreateNewUserAccount(newUserData){
		var newPassword = self.authentication.generatePassword();
		mongooseUserObject = {
			firstName: newUserData.firstName, 
			lastName: newUserData.lastName,
			emailAddress: newUserData.emailAddress,
			password: newPassword['hash'],
			admin: newUserData.admin,
			accountActivation: self.authentication.activationToken()
		};
		var userCreatePromise = self.User.create(mongooseUserObject);
		userCreatePromise.then(function(newUser){
			self.res.status(httpStatus.OK).json({'data':{'emailAddress':newUserData.emailAddress,'password':newPassword['password']}});
			self.res.end();
		})
		.catch(function(err){
			logger.error(err);
			self.res.status(httpStatus.BAD_REQUEST).json({'error':err});
		});
		//TODO send mail with password and activation link to given e-mail address
	}

	function getUpdateObjectForUserChangeableDataFields(){
		var updateData = {};
		if(self.data.hasOwnProperty('firstName')){
			updateData['firstName'] = self.data.firstName;
		}
		if(self.data.hasOwnProperty('lastName')){
			updateData['lastName'] = self.data.lastName;
		}
		if(self.data.hasOwnProperty('profileImage')){
			updateData['profileImage'] = self.data.profileImage;
		}
		if(self.data.hasOwnProperty('emailAddress')){
			updateData['emailAddress'] = self.data.emailAddress
			//TODO send verificiation mail
			//TODO use accountActivation token for verification authentication
		}
		if(self.data.hasOwnProperty('password')){
			var password = self.authentication.convertRawPassword(self.data.password);
		}	
		return updateData;
	}


	//#### PUBLIC FUNCTIONS ####

	this.get = function(){
		if(self.req.params.user_id == 'tokenUserId'){
			getOne(self.authentication.tokenUserId);
		}
		else if(authentication.isAdmin){
			self.res.status(httpStatus.OK).json(getOne(self.req.params.user_id));
		}
		else{
			self.res.status(httpStatus.FORBIDDEN).json({'error': 'Only admins have access to this ressource'});
		}
		self.res.end();
	};

	this.getAll = function(){
		//if(authentication.isAdmin(req.headers.authorization)){
		if(self.authentication.isAdmin){
			allUserPromise = self.User.findAll();
			allUserPromise.then(function(users){
				logger.debug(users[0].firstName + "METHOD: " + self.req.method);
				self.res.status(httpStatus.OK).json(users);
				self.res.end();
			})
			.catch(function(err){
				logger.error(err);
				self.res.status(httpStatus.BAD_REQUEST).send('Sorry, something went wrong');
			});
		}
		else{
			self.res.status(httpStatus.FORBIDDEN).json({'error': 'Only admins have access to this ressource'});
		}
		self.res.end();
	};

	this.post = function(){
		if(self.authentication.isAdmin){	
			adminCreateNewUserAccount(self.data);
		}
		else{
			createNewUserAccount(self.data);
		}
	};

	this.put = function(){
		if(self.req.params.user_id == 'tokenUserId'){
			var userUpdatePromise = User.update(authentication.tokenUserId, getUpdateObjectForUserChangeableDataFields());
			userUpdatePromise.then(function(){
				self.res.status(httpStatus.NO_CONTENT);
				self.res.end();
			})
			.catch(function(err){
				logger.error(err);
				self.res.status(httpStatus.BAD_REQUEST).json({error:err});
				self.res.end();
			});
		}
		else if(self.authentication.isAdmin){
			var userUpdatePromise = self.User.update(self.req.params.user_id, JSON.parse(self.data));
			userUpdatePromise.then(function(){
				self.res.status(httpStatus.NO_CONTENT).end();
			})
			.catch(function(err){
				logger.error(err);
				//TODO
			});
		}
		else{
			self.res.status(httpStatus.FORBIDDEN).json({'error': 'Only admins have access to this ressource'});
			self.res.end();
		}
	};

	this.delete = function(){
		if(self.data._id == 'tokenUserId'){
			var userPromise = User.findOne(authentication.tokenUserId);
			userPromise.then(function(user){
				//TODO 
			})
			.catch(function(err){
				logger.error(err);
			});
		}
		else if(self.authentication.isAdmin){
			User.delete(self.req.params.user_id);
			self.res.status(httpStatus.NO_CONTENT).end();
		}
		else{
			self.res.status(httpStatus.FORBIDDEN).json({'error': 'Only admins have access to this ressource'});
		}
	};

	//CONSTRUCTOR
	self = this;

	// if(req && res && authentication){
		this.req = req;
		this.res = res;
		this.authentication = authentication;
		if(req.method != 'GET'){
			this.data = JSON.parse(req.body.data);
		}

	// }
	// else{
	// 	return new Error('The parameters "req", "res" and "authentication" are required. Could not create a new UserController');
	// 	this.req, this.res = null, null;
	// }
	return this;
}


module.exports = UsersController;
