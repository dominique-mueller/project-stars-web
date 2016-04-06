//###### SCHEMA DEFINITION ######
var mongoose = require('mongoose');

var folder = new mongoose.Schema({
	name: {type: String, required: true},
	owner: {type: mongoose.Schema.Types.ObjectId, ref: 'User', require:true},
	path: {type: mongoose.Schema.Types.ObjectId, ref: 'Folder'},
	position: {type: Number},
});

var Folder = module.exports = mongoose.model('Folder', folder);