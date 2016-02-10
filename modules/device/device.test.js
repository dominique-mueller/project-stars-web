process.env.NODE_ENV = 'test';

var assert = require('chai').assert;
var mongo = require('mongoose');
var Device = require('../schemaExport').Device;
var User = require('../schemaExport').User;

var device = null;























/*
#### Schema test were removed due to a critical male functionality ####
Currently the Schema validation is made manually with a monogDB UI
*/

// describe('Test Device schema', function(){
	
// 	beforeEach('set test data to objects', function(){
// 		device = new Device();
// 	});

// 	describe('validate name, type and owner and it', function(){
// 		it('should fail to validate without a name set', function(){
			
// 			device.name = "something";
// 			device.owner = new User()._id;
// 			device.validate(function(error){
// 				if(error){
// 					console.log("Say Something XXXX");
// 				}
// 				// assert.equal(true,false);
// 				assert.ok(error);
// 				assert.equal('Path `type` is required', error.errors['name'].message);
// 			});
// 		});
// 		it('should fail to validate with only the type', function(){
// 			device.type = "Type";
// 			device.validate(function(error){
// 				assert.ok(error);
// 			}) 
// 		});
// 		it('should fail to validate the name', function(){
// 			device.name = 5;
// 			device.validate(function(error){
// 				assert.ok(error);
// 			});
// 		});
// 		it('should succed to validate name and type', function(){
// 			device.name = "Name";
// 			// device.owner = new User()._id;
// 			device.validate(function(error){
// 				// console.log(error.errors['owner'].message);
// 				assert.notOk(error);
// 			});
// 		});
// 	});
// 	describe('validate firstConnect', function(){

// 	});
// 	describe('validate lastUse', function(){

// 	});
// 	describe('validate owner', function(){

// 	});

// 	afterEach('drop test objects', function(){
// 		device = null;
// 	});
// });
