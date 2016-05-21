/*
SEE: www.theholmesoffice.com/mongoose-connection-best-practice/
GitHub: github.com/simonholmes/mongoose-default-connection
*/
var logger = require('../adapters/logger.js');
var config = require('../config.js');
var mongoose = require('mongoose');

// var databaseURL = 'mongodb://localhost/dev';
// var databaseURL = 'mongodb://devAdmin:stars-web@127.0.0.1:27017/dev';
var databaseURL = config.database.url + config.database.authorization + config.database.database;
mongoose.connect(databaseURL);

mongoose.connection.on('connected', function(){
	logger.info('Mongoose connected to ' + databaseURL);
});

mongoose.connection.on('disconnected', function(){
	logger.info('Mongoose disconnected from database');
});

mongoose.connection.on('error', function(err){
	logger.info('ERROR: An error occured while Mongoosed tried to connect to ' + databaseURL);
	logger.error(err);
});

process.on('exit', function(){
	mongoose.connection.close(function(){
		logger.info('Mongoose disconnected from database through app termination');
	});
});

