process.env.NODE_ENV = 'test';

//testing requirements
var chai = require("chai"), 
	assert = require('chai').assert;
var chaiAsPromised = require("chai-as-promised");
var mockery =  require('mockery');
chai.use(chaiAsPromised);

//adapter requirements:
require('es6-promise').polyfill();
var authentication = require('../../adapters/authentication.js');
var jwt = require('jsonwebtoken');
var scrypt = require('scrypt');
var scryptParameters = scrypt.paramsSync(0.1);
var secret = require('../../config.js').authentication.secret;
var User = require('../../modules/schemaExport.js').User;

//variables and function to mock
var user;
var userModel = {
	find: function(searchEMailAddress){
			return new Promise(function(resolve, reject){
				if(user.emailAddress == searchEMailAddress.emailAddress){
					resolve(user);
				}
				else{
					reject(new Error("could not find user by emailAddress"));
				}
			});
	}
};
// authentication.getUser = function(emailAddress)

//#### TESTS ####
describe('Test authentication adapter: ', function(){
	beforeEach('Before each test.', function(){
		// console.log('before each authentication test');
	});

	describe('convertRawPassword() test: ', function(){
		it('should fail because the parameters are not equal', function(){
			return assert.isRejected(authentication.convertRawPassword('right', 'wrong'), 'rejected, cause passwords aren\'t equal');
		});
		it('should succeed because both parameters are equal', function(){
			return assert.isFulfilled(authentication.convertRawPassword('right', 'right'), 'successfully hashed password');
		});
	});

	describe('login() test: ', function(){
		before(function(){
			mockery.enable();
			mockery.registerMock('../../modules/user/users.model.js', userModel);
			user = new User({
				firstName: "Tim",
				lastName: "One",
				emailAddress: "tim.one@stars-web.de",
				password: authentication.convertRawPassword('test123', 'test123'),
				admin: false,
			});
		});

		it('should succss to mock the userModel', function(done){
			return assert.isFulfilled(require('../../modules/user/users.model.js').find({'emailAddress':'tim.one@stars-web.de'}));
			done();
			// authentication.getUser('tim.one@stars-web.de', function(user){
			// 	console.log(user);
			// 	done();
			// })
		});

		it('should fail to login because the user isn\'t found', function(done){
			return assert.isRejected(authentication.login({emailAddress:'wrong@mail.com',password:'test123'}));
			done();
		});
		it('should fail to login because the password is wrong', function(done){
			return assert.isRejected(authentication.login({emailAddress:'tim.one@stars-web.de',password:'wrongPassword'}));
			done();
		});
		it('should success to login', function(done){
			return assert.isFulfilled(authentication.login({emailAddress:'tim.one@stars-web.de',password:'test123'}));
			done();
		});

		after(function(){
			mockery.deregisterMock('../modules/user/users.model.js');
			mockery.disable();
		});
	});

	describe('verifyToken test', function(){

	});
});

