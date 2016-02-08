process.env.NODE_ENV = 'test';

var assert = require('chai').assert;
var mongo = require('mongoose');
var Device = require('../schemaExport').Device;
var User = require('../schemaExport').User;

var device = null;

describe('Test Device schema', function(){
	
	beforeEach('set test data to objects', function(){
		device = new Device();
	});

	describe('validate name, type and owner and it', function(){
		it('should fail to validate without a name set', function(){
			
			device.name = "something";
			device.owner = new User()._id;
			device.validate(function(error){
				if(error){
					console.log("Say Something XXXX");
				}
				// assert.equal(true,false);
				assert.ok(error);
				assert.equal('Path `type` is required', error.errors['name'].message);
			});
		});
		it('should fail to validate with only the type', function(){
			device.type = "Type";
			device.validate(function(error){
				assert.ok(error);
			}) 
		});
		it('should fail to validate the name', function(){
			device.name = 5;
			device.validate(function(error){
				assert.ok(error);
			});
		});
		it('should succed to validate name and type', function(){
			device.name = "Name";
			// device.owner = new User()._id;
			device.validate(function(error){
				// console.log(error.errors['owner'].message);
				assert.notOk(error);
			});
		});
	});
	describe('validate firstConnect', function(){

	});
	describe('validate lastUse', function(){

	});
	describe('validate owner', function(){

	});

	afterEach('drop test objects', function(){
		device = null;
	});
});

















// var assert = require('assert');
// // require('../connectDB.js');
// var DBSchemas = require('../schemaExport.js');
// var mongoose = require('mongoose');

// describe('Describe function', function(){
// 	var db;
// 	before('before device schema test', function(){
// 		mongoose.connect('mongodb://localhost');
// 		mongoose.connection.on('error', function(err){
// 			console.log('ERROR: An error occured while Mongoosed tried to connect to test database');
// 			console.error(err);
// 		});
// 	});
// 	beforeEach('before each', function(done){
// 		var device = new DBSchemas.Device();
// 		device.name = 'Test';
// 		device.type = 'Android Smartphone';
// 		device.save(done);
// 	});


// 	describe('Test Function', function(){
// 		it('Something', function(){
// 			// assert.equal(-1, [1,2,3].indexOf(5));
// 			// assert.equal(-1, [1,2,3].indexOf(0));
// 			DBSchemas.Device.find({name : 'Test'}, function(err, results){
// 				console.log("Type: ".concat(results[0].type));
// 				DBSchemas.Device.findByIdAndRemove(results[0]._id);
// 			});
// 		});

// 	});

// 	afterEach('after each', function(){	

// 	});
// 	after('after device schema test', function(){
// 		mongoose.connection.close(function(){
// 			console.log('Mongoose disconnected from test database');
// 		});
// 	});
// });




// myThing.validated_property = 5;
// myThing.validate(function(err) {
//     if (err) { console.log('nope!') }       
// });