
/*
THIS FILE IS ONLY FOR DEVELOPMENT AND NOT MEANT TO BE IN THE PRODUCTIVE APP
THE RIGTHS FOR EXISTENCE OF THIS FILE IS BASED ON SIMPLE TESTS ABOUT LANGUAGE SPECIFIC BEHAVIOUR
*/





//{"firstName":"Tim", "lastName":"Timer","emailAddress":"tim.timer@stars-web.de", "password":"stars-web-1"}

// require('es6-promise').polyfill();
var auth = require('./adapters/authentication.js');
var User = require('./modules/schemaExport.js').User;





//##### ADMIN MONGO BUG WITH OBJECT IDs
// {"$oid":"<id>"}
//#####




// function MyClass(){
// 	this.publicAttribute;
// 	var privateAttrbute;
// 	var the = this; 

// 	function privateFunction(){
// 		console.log('I am here in the private function');
// 		console.log('publicAttribute: ' + the.publicAttribute);
// 		console.log('privateAttribute: ' + privateAttrbute);
// 	};

// 	this.thisPrivateFunction = function(){
// 		console.log('I am here in the this private function');
// 		console.log('publicAttribute: ' + this.publicAttribute);
// 		console.log('privateAttribute: ' + privateAttrbute);
// 		privateFunction();
// 	};

// 	this.thisPrivateFunctionTwo = function(){
// 		console.log('something');
// 	};

// 	console.log('I am the contructor');
// 	this.publicAttribute = 5;
// 	privateAttrbute = 10;
// }


// MyClass.prototype.publicFunction = function(){
// 	console.log('I am here in the public function');
// 	console.log('publicAttribute: ' + this.publicAttribute);
// 	// console.log('privateAttribute: ' + privateAttrbute);
// 	// privateFunction();
// 	this.thisPrivateFunction();
// }


// var myClass = new MyClass();
// myClass.publicFunction();
// myClass.thisPrivateFunction();

// console.log('myClass pub Attr:' + myClass.publicAttribute);
// console.log('myClass priv Attr: ' + myClass.privateAttribute);
// console.log("");
// console.log("Test static prototype calls");
// MyClass.publicFunction();











var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var secret = require('./config.js').authentication.secret;

var token =  jwt.sign({
	userId: new User()._id,
	// userId:'56f12f02c6ab44a50e881151',
	admin: true
}, secret,{expiresIn: '365d'});


// var token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiI1NzUyZGFjYTNmYjU0YzgzMWRiM2I3OWIiLCJhZG1pbiI6dHJ1ZSwiaWF0IjoxNDY1MDQ3NzU0LCJleHAiOjE0OTY1ODM3NTR9.cCiI5-prQjG1epVafvcdSbrPazYXXdqnGwAJE9FFjpc';

console.log('Token: ' + token);

// var getDecodePromise = function (){
// 	return new Promise(function(resolve, reject){
// 		jwt.verify(token, secret, function(err, decoded){
// 			if(err){
// 				reject(err);
// 			}
// 			else{
// 				resolve(decoded);
// 			}
// 		});
// 	});
// }

// var fullfilDecodePromise = function(callback){
// 	var decodePromise = getDecodePromise();
// 	decodePromise.then(function(decoded){
// 		console.log('fullfilDecodePromise: ' + decoded);
// 		callback(true);
// 		//return true;
// 	})
// 	.catch(function(err){
// 		console.log('fullfilDecodePromise: ' + err);
// 		callback(err);
// 		//return err;
// 	});
// }


// // //var result = sync.await(fullfilDecodePromise(sync.defer()));
// // //console.log('Awaited result: ' + result);

// result = null;
// fullfilDecodePromise(function(resultCallback){
// 	console.log('Not awaited result: ' + resultCallback);
// });











// var convertRawPassword = function(password){
// 	try{
// 		var hash = scrypt.kdfSync(password, scryptParameters);
// 		return hash;
// 	}
// 	catch(e){
// 		return new Error('failed to convert the password');
// 	}
// }

// console.log('Hashed Password: ' + convertRawPassword('mySecurePassword'));





// var testFlag = true;

// var test = new Promise(function(resolve, reject){
// 	if(testFlag){
// 		resolve('Test was successfull');
// 	}
// 	else{
// 		reject('ERROR: testFlag not set');
// 	}
// });

// test.then(function(result){
// 	console.log(result);
// })
// .catch(function(err){
// 	console.log(err);
// });








// var chai = require('chai');
// var mockery =  require('mockery');
// var chai_as_promised = require('chai-as-promised');



// var User = require('./modules/schemaExport.js').User;

// console.log("###EACH PATH###");

// User.schema.eachPath(function(path){
// 	console.log(path + " :: " + User.schema.pathType(path));
// });

// console.log('');
// console.log('');
// console.log("###PATH###");

// // for(var i = 0; i < User.path.length; i++){
// // 	console.log()
// // }
// console.log(User.path);

// console.log('');
// console.log('');

// var reqPaths = User.schema.requiredPaths;
// for(var i = 0; i < reqPaths.length; i++){
// 	console.log(reqPaths[i]);
// }