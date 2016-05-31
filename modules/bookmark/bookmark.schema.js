//###### SCHEMA DEFINITION ######
var mongoose = require('mongoose');

var bookmark = new mongoose.Schema({
	title: {type: String, required: true},
	url: {type: String, required:true},
	owner: {type: mongoose.Schema.Types.ObjectId, ref: 'User', require:true},
	description: {type: String},
	labels:[{type: mongoose.Schema.Types.ObjectId, ref: 'Label'}],
	favicon: {type: String, default:""},
	path: {type: mongoose.Schema.Types.ObjectId, ref: 'Folder'},
	position: {type: Number, required: true},
	created: {type: Date, default: Date.now},
	updated: Date, 
	archived: Date 
});

var Bookmark = module.exports = mongoose.model('Bookmark', bookmark);