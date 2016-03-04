process.env.NODE_ENV = 'test';

var chai = require("chai"), 
	assert = require('chai').assert;
var chaiAsPromised = require("chai-as-promised");

chai.use(chaiAsPromised);
//adapter requirements:
var jwt = require('jsonwebtoken');
var scrypt = require('scrypt');
var scryptParameters = scrypt.paramsSync(0.1);
var secret = require('../config.js').authentication.secret;

describe('Test authentication adapter: ', function(){
	beforeEach('Before each test.', function(){
		console.log('before each authentication test');
	});

	describe('convertRawPassword() test', function(){
		it('should fail because the parameters are not equal', function(){
			assert.
		});
		it('should succeed because both parameters are equal', function(){

		});
	});
});