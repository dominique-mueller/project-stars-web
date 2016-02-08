/*
SEE: www.theholmesoffice.com/mongoose-connection-best-practice/
GitHub: github.com/simonholmes/mongoose-default-connection
*/
var mongoose = require('mongoose');

var databaseURL = 'mongodb://localhost';
mongoose.connect(databaseURL);

mongoose.connection.on('connected', function(){
	console.log('Mongoose connected to ' + databaseURL);
});

mongoose.connection.on('disconnected', function(){
	console.log('Mongoose disconnected from database');
});

mongoose.connection.on('error', function(err){
	console.log('ERROR: An error occured while Mongoosed tried to connect to ' + databaseURL);
	console.error(err);
});

process.on('exit', function(){
	mongoose.connection.close(function(){
		console.log('Mongoose disconnected from database through app termination');
	});
});

