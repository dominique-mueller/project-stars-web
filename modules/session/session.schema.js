//###### SCHEMA DEFINITION ######
var mongoose = require('mongoose');

var session = new mongoose.Schema({
	jwt: {type: String, require: true},
	device: {type: mongoose.Schema.Types.ObjectId, ref: 'Device', required: true},
	owner: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true}
});

var Session = module.exports = mongoose.model('Session', session);

