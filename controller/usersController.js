var logger = require('./logger.js');
// var authentication = require('./adapters/authentication.js'); DEPRECATED. AUTHENTICATION OBJECT IN 'UsersController' PARAMETER
var httpStatus = require('./config.js').httpStatus;
var eMail = require('./eMail');

function UsersController(req, res, authentication){
	this.User = require('./modules/schemaExport.js').User;
	this.req, this.res, this.authentication;
	var privateThis;


	//#### PRIVATE FUNCTIONS ####

	function getOne(userId){
		 var userPromise = privateThis.User.findOne(userId);
		 userPromise.then(function(user){
		 	return user;
		 })
		 .catch(function(err){
		 	privateThis.res.status(httpStatus.BAD_REQUEST).json('error':err);
		 	privateThis.res.end();
		 });
	}
	
	function deactivate(){

	}

	// function checkReqRes(){
		
	// }

	function createNewUserAccount(newUserData){
		mongooseUserObject = {
			firstName: newUserData.firstName, 
			lastName: newUserData.lastName,
			emailAddress: newUserData.emailAddress,
			password: authentication.convertRawPassword(newUserData.passwordOne, newUserData.passwordTwo),
			accountActivation: authentication.activationToken()
		};
		var userCreatePromise = privateThis.User.create(mongooseUserObject);
		userCreatePromise.then(function(newUser){

		})
		.catch(function(err){
			privateThis.res.status(httpStatus.BAD_REQUEST).json({'error':err});
		});
		/* TODO
		account activation
		send mail with activation link
		*/
	}

	function adminCreateNewUserAccount(newUserData){
		var newPassword = authentication.generatePassword();
		mongooseUserObject = {
			firstName: newUserData.firstName, 
			lastName: newUserData.lastName,
			emailAddress: newUserData.emailAddress,
			password: newPassword['hash'],
			accountActivation: authentication.activationToken()
		};
		var userCreatePromise = privateThis.User.create(mongooseUserObject);
		userCreatePromise.then(function(newUser){

		})
		.catch(function(err){
			privateThis.res.status(httpStatus.BAD_REQUEST).json({'error':err});
		});
		//TODO send mail with password and activation link to given e-mail address
	}


	//#### PUBLIC FUNCTIONS ####

	this.get = function(){
		if(req.body.data._id == 'tokenUserId'){
			// authentication.setToken(req.headers.authorization);
			// var userIdPromise = authentication.tokenUserId;
			// userIdPromise.then(function(userId){
			// 	res.status(httpStatus.OK).json(getOne(userId));
			// })
			// catch(function(err){
			// 	logger.error(err);
			// 	res.status(httpStatus.BAD_REQUEST).json({'error':err});
			// });

			//after authentication rewrite
			res.status(httpStatus.OK).json(getOne(authentication.tokenUserId));
		}
		else if(authentication.isAdmin){
			res.status(httpStatus.OK).json(getOne(req.body.data._id));
		}
		else{
			res.status(httpStatus.FORBIDDEN).json('error': 'Only admins have access to this ressource');
		}
		res.end();
	}

	this.getAll == function(){
		//if(authentication.isAdmin(req.headers.authorization)){
		if(authentication.isAdmin){
			allUserPromise = User.findAll();
			allUserPromise.then(function(users){
				res.status(httpStatus.OK);
				res.json(users);
			})
			.catch(function(err){
				res.status(httpStatus.BAD_REQUEST).send('Sorry, something went wrong');
			});
		}
		else{
			res.status(httpStatus.FORBIDDEN).json('error': 'Only admins have access to this ressource');
		}
		res.end();
	}

	this.post = function(){
		// if(authentication.isAdmin(req.headers.authorization)){
		if(authentication.isAdmin){	
			adminCreateNewUserAccount(req.body.data);
		}
		else{
			//TODO: remove if-else because even if there is an admin property it will be never used
			// if(newUserData.hasOwnPorperty('admin')){
			// 	res.status(httpStatus.INVALID_INPUT).json('error': 'The input data is invalid');
			// }
			// else{
			createNewUserAccount(req.body.data);
			// }
		}
	}

	this.put = function(){
		if(req.body.data._id == 'tokenUserId'){
			/*
			if password:
				get old password and the two times entered new password -> update it
			else if email:
				send mail to new account with update link. after link activation the email will be updated
			else if admin | accountActivation:
				refuse 
			else:
				just do it
			*/
		}
		else if(authentication.isAdmin){
			var userUpdatePromise = this.User.update(req.body.data);
			userUpdatePromise.then(function(){
				res.status(httpStatus.NO_CONTENT).end();
			})
			.catch(function(err){
				//TODO
			});
		}
		else{
			res.status(httpStatus.FORBIDDEN).json('error': 'Only admins have access to this ressource');
		}
	}

	this.delete = function(){
		if(req.body.data._id == 'tokenUserId'){
			var userPromise = User.findOne(authentication.tokenUserId);
			userPromise.then(function(user){
				
			})
			.catch(function(err){

			});
		}
		else if(authentication.isAdmin(req.headers.authorization)){
			User.delete(req.body.data._id);
		}
		else{
			res.status(httpStatus.FORBIDDEN).json({'error': 'Only admins have access to this ressource'});
		}
	}

	this.setControllerAttributes = function(req, res){
			this.req, this.res = req, res;
	}



	//CONSTRUCTOR
	privateThis = this;

	if(req && res && authentication){
		this.req = req;
		this.res = res;
		this.authentication = authentication;
	}
	else{
		return new Error('The parameters "req", "res" and "authentication" are required. Could not create a new UserController');
		this.req, this.res = null, null;
	}
}


module.exports = UsersController;
