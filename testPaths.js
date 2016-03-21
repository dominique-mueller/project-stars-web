require('es6-promise').polyfill();
var auth = require('./adapters/authentication.js');

// var test = auth.convertRawPassword('right', 'right');
// test.then(function(result){
// 	console.log(result);
// })
// .catch(function(err){
// 	console.log(err);
// });

var jwt = require('jsonwebtoken');
var scrypt = require('scrypt');
var scryptParameters = scrypt.paramsSync(0.1);
var secret = require('./config.js').authentication.secret;
var sync = require('synchronize');

// var token =  jwt.sign({
// 	userId: 1234567890,
// 	admin: true,
// }, secret,{expiresIn: 1440});

var token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjEyMzQ1Njc4OTAsImFkbWluIjp0cnVlLCJpYXQiOjE0NTgxMzAwNTksImV4cCI6MTQ1ODEzMTQ5OX0.pxoxLRYLl_Vy4FtnfTztijHSbwzb4T0S1OWQdKsNnBs';

console.log('Token: ' + token);
var getDecodePromise = function (){
	return new Promise(function(resolve, reject){
		jwt.verify(token, secret, function(err, decoded){
			if(err){
				reject(err);
			}
			else{
				resolve(decoded);
			}
		});
	});
}

var fullfilDecodePromise = function(callback){
	var decodePromise = getDecodePromise();
	decodePromise.then(function(decoded){
		console.log('fullfilDecodePromise: ' + decoded);
		callback(true);
		//return true;
	})
	.catch(function(err){
		console.log('fullfilDecodePromise: ' + err);
		callback(err);
		//return err;
	});
}


var result = sync.await(fullfilDecodePromise(sync.defer()));
console.log('Awaited result: ' + result);

result = null;
fullfilDecodePromise(function(resultCallback){
	console.log('Not awaited result: ' + resultCallback);
});








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