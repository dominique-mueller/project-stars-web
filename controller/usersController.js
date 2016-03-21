var logger = require('./logger.js');
var authentication = require('../adapters/authentication.js');
var httpStatus = require('../config.js').httpStatus;
var eMail = require('./eMail');

function usersController(req, res){
	var User = require('../modules/schemaExport.js').User;
	var this.req, this.res;

	function getOne(userId){
		 var userPromise = User.findOne(userId);
		 userPromise.then(function(user){
		 	return user;
		 })
		 .catch(function(err){
		 	res.status(httpStatus.BAD_REQUEST).json('error':err);
		 	res.end();
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
		var userCreatePromise = User.create(mongooseUserObject);
		userCreatePromise.then(function(newUser){

		})
		.catch(function(err){
			res.status(httpStatus.BAD_REQUEST).json({'error':err});
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
		var userCreatePromise = User.create(mongooseUserObject);
		userCreatePromise.then(function(newUser){

		})
		.catch(function(err){
			res.status(httpStatus.BAD_REQUEST).json({'error':err});
		});
		//TODO send mail with password and activation link to given e-mail address
	}

	//CONSTRUCTOR
	if(req && res){
		this.req, this.res = req, res;
	}
	else{
		this.req, this.res = null, null;
	}
}

usersController.prototype.get = function(){
	if(req.body.data._id == 'tokenUserId'){
		var userIdPromise = authentication.getUserId(req.headers.authorization);
		userIdPromise.then(function(userId){
			res.status(httpStatus.OK).json(getOne(userId));
		})
		catch(function(err){
			logger.error(err);
			res.status(httpStatus.BAD_REQUEST).json({'error':err});
		});
	}
	else if(authentication.isAdmin(req.headers.authorization)){
		res.status(httpStatus.OK).json(getOne(req.body.data._id));
	}
	else{
		res.status(httpStatus.FORBIDDEN).json('error': 'Only admins have access to this ressource');
	}
}

usersController.prototype.getAll == function(){
	if(authentication.isAdmin(req.headers.authorization)){
		allUserPromise = User.findAll();
		allUserPromise.then(function(users){
			res.status(httpStatus.OK);
			res.json(users);
			res.end();
		})
		.catch(function(err){
			res.status(httpStatus.BAD_REQUEST).send('Sorry, something went wrong');
		});
	}
	else{
		res.status(httpStatus.FORBIDDEN).json('error': 'Only admins have access to this ressource');
	}
}

usersController.prototype.post = function(){
	if(authentication.isAdmin(req.headers.authorization)){
		adminCreateNewUserAccount(req.body.data);
	}
	else{
		//TODO: remove if-else because even if there is an admin property it will be never used
		if(newUserData.hasOwnPorperty('admin')){
			res.status(httpStatus.INVALID_INPUT).json('error': 'The input data is invalid');
		}
		else{
			createNewUserAccount(req.body.data);
		}
	}
}

usersController.prototype.put = function(){
	if(req.body.data._id == 'tokenUserId'){

	}
	else if(authentication.isAdmin(req.headers.authorization)){
		
	}
	else{
		res.status(httpStatus.FORBIDDEN).json('error': 'Only admins have access to this ressource');
	}

	/*
	if data contains 'tokenUserId':
		if fields data contains none of [mail, password, ADMIN, registered]
	*/
}

usersController.prototype.delete = function(){
	if(req.body.data._id == 'tokenUserId'){
		var userPromise = User.findOne(authentication.getUserId(req.headers.authorization));
		userPromise.then(function(user){
			
		})
		.catch(function(err){

		});
	}
	else if(authentication.isAdmin(req.headers.authorization)){
		User.delete(req.body.data._id);
	}
	else{
		res.status(httpStatus.FORBIDDEN).json('error': 'Only admins have access to this ressource');
	}
}

usersController.prototype.setControllerAttributes = function(req, res){
		this.req, this.res = req, res;
}

module.exports = usersController;
