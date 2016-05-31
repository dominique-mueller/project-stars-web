//###### SCHEMA DEFINITION ######
var mongoose = require('mongoose');

var device = new mongoose.Schema({
	name: {type: String, required: true},
	type: {type: String},
	firstConnect: {type: Date, default: Date.now},
	lastUse: {type: Date, default: Date.now},
	session:{
		active:{type:Boolean, default:false},
		jwt:{type:String}
	},
	owner: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true}
});

var Device = mongoose.model('Device', device);
module.exports = Device;