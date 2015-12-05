//###### SCHEMA DEFINITION ######
var mongoose = require('mongoose');

var settings = new mongoose.Schema({
	storage: [],
	owner: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}	
});

var Settings = module.export = mongoose.model('Settings', settings);