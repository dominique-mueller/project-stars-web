var logger = require('../adapters/logger.js');
var httpStatus = require('../config.js').httpStatus;
// var eMail = require('./eMail'); 	//reminder for later development with e-mail adapter

var UsersController = function(req, res, authentication){
	
	var self; //@see: adapters/authentication.js 
	this.User = require('../modules/user/users.model.js');
	this.User = new User(this, authentication.tokenUserId);
	this.req, this.res, this.authentication, this.data;

	//#### PRIVATE FUNCTIONS ####

	function getOne(userId){
		logger.debug('getOne!!');
		var userPromise = self.User.findOne(userId);
		userPromise.then(function(user){
		 	logger.debug('userPromise then');
		 	self.res.status(httpStatus.OK).json({data:user});
		})
		.catch(function(err){
			logger.error(err);
			self.res.status(httpStatus.BAD_REQUEST).json({'error':err});
		});
	}
	
	function deactivate(){

	}

	function createUser(newUserData){
		var mongooseUserObject = {
			firstName: newUserData.firstName, 
			lastName: newUserData.lastName,
			emailAddress: newUserData.emailAddress,
			accountActivation: self.authentication.activationToken()
		};
		var userCreatePromise;
		
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
				.catch(function(err){
					logger.error(err);
					//TODO: check for unique (email address not unique) error.
					self.res.status(httpStatus.BAD_REQUEST).json({'error':err});
				});
			},

			asAdmin: function(){
				mongooseUserObject['password'] = newPassword['hash'];
				mongooseUserObject['admin'] = newUserData.admin;

				userCreatePromise = self.User.create(mongooseUserObject);
				userCreatePromise.then(function(newUser){
					self.res.status(httpStatus.OK).json({'data':{'emailAddress':newUserData.emailAddress,'password':newPassword['password']}});
					self.res.end();
					createRootFolder(newUser._id);
				})
				.catch(function(err){
					logger.error(err);
					self.res.status(httpStatus.BAD_REQUEST).json({'error':err});
				});
				//TODO send mail with password and activation link to given e-mail address
			}
		}
	}

	function createRootFolder(userId){
		var rootFolder = {
			name:'.',	//every root folder has this name. 
						//furthermore this name is reserved and cannot be created a second time per user
			path:undefined
		}
		var folderCreatePromise = require('../modules/folder/folders.model.js')(this, userId).create(rootFolder);
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
		 	updateData['password'] = self.authentication.convertRawPassword(self.data.password);
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
			self.res.status(httpStatus.FORBIDDEN).json({'error': 'Only admins have access to this ressource'});
		}
	};

	this.getAll = function(){
		if(self.authentication.isAdmin){
			allUserPromise = self.User.findAll();
			allUserPromise.then(function(users){
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
			self.res.end();
		}
	};

	this.post = function(){
		var userCreate = new createUser(self.data)
		if(self.authentication.isAdmin){	
			userCreate.asAdmin();
		}
		else{
			userCreate.register();
		}
	};

	this.put = function(){
		var userUpdatePromise;
		if(self.req.params.user_id == 'tokenUserId'){
			userUpdatePromise = self.User.update(authentication.tokenUserId, getUpdateObjectForUserChangeableDataFields());
		}
		else if(self.authentication.isAdmin){
			userUpdatePromise = self.User.update(self.req.params.user_id, JSON.parse(self.data));
		}
		else{
			self.res.status(httpStatus.FORBIDDEN).json({'error': 'Only admins have access to this ressource'});
			self.res.end();
			return;
		}

		userUpdatePromise.then(function(){
			self.res.status(httpStatus.NO_CONTENT).end();
		})
		.catch(function(err){
			logger.error(err);
			self.res.status(httpStatus.BAD_REQUEST).json({error:err});
			self.res.end();
		});
	};

	this.delete = function(){
		//TODO Delete the root Folder and everything else
		if(self.data._id == 'tokenUserId'){
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
			self.res.status(httpStatus.FORBIDDEN).json({'error': 'Only admins have access to this ressource'});
		}
	};

	//CONSTRUCTOR
	self = this;
	this.req = req;
	this.res = res;
	this.authentication = authentication;
	if(req.method != 'GET'){
		this.data = JSON.parse(req.body.data);
	}

	return this;
}


module.exports = UsersController;
