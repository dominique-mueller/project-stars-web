//###### SCHEMA DEFINITION ######
var mongoose = require('mongoose');

var device = new mongoose.Schema({
	name: {type: String, required: true},
	type: {type: String},
	firstConnect: {type: Date, default: Date.now},
	lastUse: {type: Date, default: Date.now},
	owner: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true}
});

var Device = mongoose.model('Device', device);
module.exports = Device;