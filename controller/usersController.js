var logger = require('../adapters/logger.js');
var httpStatus = require('../config.js').httpStatus;
var helpers = require('../helpers/generalHelpers.js');
// var eMail = require('./eMail'); 	//reminder for later development with e-mail adapter

var UsersController = function(req, res, authentication){
	
	var self = this; //@see: adapters/authentication.js 
	this.authentication = authentication;
	this.User = require('../modules/user/users.model.js');
	this.req = req;
	this.res = res;
	this.reqBody;


	//CONSTRUCTOR
	if(req.method != 'GET'){
		this.reqBody = JSON.parse(req.body.data);
	}
	if(req.method == 'POST'){
		this.User = new User(this, null);
	}
	else{
		this.User = new User(this, authentication.tokenUserId)
	}


	//#### PRIVATE FUNCTIONS ####

	function respondeWithError(message){
		return function(err){
			logger.error("respondeWithError: "  + message + " :: " + err);
			self.res.status(httpStatus.BAD_REQUEST)
			.json({'error':message});
		}
	}

	function getOne(userId){
		logger.debug('getOne!!');
		var userPromise = self.User.findOne(userId);
		userPromise.then(function(user){
		 	logger.debug('userPromise then');
		 	self.res.status(httpStatus.OK)
		 		.json({'data':
		 			helpers.mongooseObjToFrontEndObj(user)
		 		}
		 	);
		})
		.catch(respondeWithError('could not find the requested user'));
	}
	
	function deactivate(){
		//TODO first deaktivate accounts instead of deleteing them
		//a real deletion should only be done when a deaktivated account will be deleted
	}

	/*
	create users sets all keys of an user object which are the same for both returned functions
	@return: returns an Object containing two functions. The function register and asAdmin
		register: is used, with the api 'users/register' 
		asAdmin: used in case an user account is created by an admin
		Both functions have a slightly different implementation 
	*/
	function createUser(newUserData){
		var mongooseUserObject = {
			firstName: newUserData.firstName, 
			lastName: newUserData.lastName,
			emailAddress: newUserData.emailAddress,
			accountActivation: self.authentication.activationToken()
		};
		var userCreatePromise;
		logger.debug("createUser: " +newUserData.firstName);
		
		return {
			register: function(){
				mongooseUserObject['password'] = self.authentication.convertRawPassword(newUserData.password);
				userCreatePromise = self.User.create(mongooseUserObject);
				userCreatePromise.then(function(newUser){
					tokenPromise = self.authentication.login();
					/* TODO
					login
					account activation
					send mail with activation link
					*/
					self.res.status(httpStatus.NO_CONTENT);
					self.res.end();
					createRootFolder(newUser._id);
				})
				.catch(respondeWithError('failed to register'));
			},

			asAdmin: function(newPassword){
				mongooseUserObject['password'] = newPassword['hash'];
				mongooseUserObject['admin'] = newUserData.admin;

				userCreatePromise = self.User.create(mongooseUserObject);
				userCreatePromise.then(function(newUser){
					self.res.status(httpStatus.OK)
					.json({'data':{
						'emailAddress':newUserData.emailAddress,
						'password':newPassword['password']}
					});
					createRootFolder(newUser._id);
				})
				.catch(respondeWithError('failed to create new user account'));
				//TODO send mail with password and activation link to given e-mail address
			}
		}
	}

	function createRootFolder(userId){
		// var rootFolder = {
		// 	name:'.',	//every root folder has this name. 
		// 				//furthermore this name is reserved and cannot be created a second time per user
		// 	path:undefined
		// }
		var folderCreatePromise = require('../modules/folder/folders.model.js')(this, userId).createRootFolder();
		folderCreatePromise.then(function(){
			logger.debug('Created Root Folder');
		})
		.catch(function(err){
			logger.error(err);
		})
	};

	function getUpdateObjectForUserChangeableDataFields(){
		// TODO: move this function to the users.model
		var updateData = {};
		if(self.reqBody.hasOwnProperty('firstName')){
			updateData['firstName'] = self.reqBody.firstName;
		}
		if(self.reqBody.hasOwnProperty('lastName')){
			updateData['lastName'] = self.reqBody.lastName;
		}
		if(self.reqBody.hasOwnProperty('profileImage')){
			updateData['profileImage'] = self.reqBody.profileImage;
		}
		if(self.reqBody.hasOwnProperty('emailAddress')){
			updateData['emailAddress'] = self.reqBody.emailAddress
			//TODO send verificiation mail
			//TODO use accountActivation token for verification authentication
		}
		if(self.reqBody.hasOwnProperty('password')){
		 	updateData['password'] = self.authentication.convertRawPassword(self.reqBody.password);
		}	
		return updateData;
	}


	//#### PUBLIC FUNCTIONS ####

	this.get = function(){
		if(self.req.params.user_id == 'tokenUserId'){
			getOne(self.authentication.tokenUserId);
		}
		else if(authentication.isAdmin){
			logger.debug('GET one params: ' + self.req.params.user_id);
			getOne(self.req.params.user_id);
		}
		else{
			self.res.status(httpStatus.FORBIDDEN)
			.json({'error':'Only admins have access to this ressource'});
		}
	};

	this.getAll = function(){
		if(self.authentication.isAdmin){
			allUserPromise = self.User.findAll();
			allUserPromise.then(function(users){
				self.res.status(httpStatus.OK).json({'data':users});
			})
			.catch(respondeWithError('Sorry, something went wrong'));
		}
		else{
			self.res.status(httpStatus.FORBIDDEN)
			.json({'error': 'Only admins have access to this ressource'});
		}
	};

	this.post = function(){
		var userCreate = new createUser(self.reqBody);
		if(self.authentication.isAdmin){	
			userCreate.asAdmin(authentication.generatePassword());
		}
		else{
			logger.debug("call register");
			userCreate.register();
		}
	};

	this.put = function(){
		var userUpdatePromise;
		if(self.req.params.user_id == 'tokenUserId'){
			userUpdatePromise = self.User.update(authentication.tokenUserId, getUpdateObjectForUserChangeableDataFields());
		}
		else if(self.authentication.isAdmin){
			userUpdatePromise = self.User.update(self.req.params.user_id, JSON.parse(self.reqBody));
		}
		else{
			self.res.status(httpStatus.FORBIDDEN)
				.json({'error': 'Only admins have access to this ressource'}
			);
			self.res.end();
			return;
		}

		userUpdatePromise.then(function(){
			self.res.status(httpStatus.NO_CONTENT).end();
		})
		.catch(respondeWithError('failed to update user'));
	};

	this.delete = function(){
		//TODO Delete the root Folder and everything else
		if(self.reqBody._id == 'tokenUserId'){
			var userPromise = User.findOne(authentication.tokenUserId);
			userPromise.then(function(user){
				//TODO deactivate instead of delete
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
			self.res.status(httpStatus.FORBIEDDEN)
			.json({'error': 'Only admins have access to this ressource'});
		}
	};


	return this;
}


module.exports = UsersController;
