//###### SCHEMA DEFINITION ######
var mongoose = require('mongoose');

var folder = new mongoose.Schema({
	name: {type: String, required: true},
	owner: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required:true},
	path: {type: mongoose.Schema.Types.ObjectId, ref: 'Folder', required:true},
	position: {type: Number},
	isRoot: {type: Boolean, default:false},
	// numberOfContainedElements: {type: Number, default:0},
	numberOfContainedFolders: {type: Number, default:0},
	numberOfContainedBookmarks: {type: Number, default:0},
	created: {type: Date, default: Date.now}
});

var Folder = module.exports = mongoose.model('Folder', folder);