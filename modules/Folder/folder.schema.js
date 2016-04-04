//###### SCHEMA DEFINITION ######
var mongoose = require('mongoose');

var folder = new mongoose.Schema({
	title: {type: String, required: true},
	owner: {type: mongoose.Schema.Types.ObjectId, ref: 'User', require:true},
	bookmarks: [{type: mongoose.Schema.Types.ObjectId ,ref: 'Bookmark'}],
	folders: [{type: mongoose.Schema.Types.ObjectId, ref: 'Folder'}]
});

var Folder = module.exports = mongoose.model('Folder', folder);