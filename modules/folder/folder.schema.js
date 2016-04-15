//###### SCHEMA DEFINITION ######
var mongoose = require('mongoose');

var folder = new mongoose.Schema({
	name: {type: String, required: true},
	owner: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required:true},
	path: {type: mongoose.Schema.Types.ObjectId, ref: 'Folder', required:true},
	position: {type: Number},
	numberOfContainingElements: {type: Number, default:0}
});

var Folder = module.exports = mongoose.model('Folder', folder);