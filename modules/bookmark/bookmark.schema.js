//###### SCHEMA DEFINITION ######
var mongoose = require('mongoose');

var bookmark = new mongoose.Schema({
	title: {type: String, required: true},
	description: {type: String},
	url: {type: String, required;true},
	favicon: {type: String},
	tags:[{type: mongoose.Schema.Types.ObjectId, ref: 'Label'}],
	created: {type: Date, default: Date.now},
	updated: Date,
	archived: Date,
	path:[],
	position: Number,
	owner: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
});

var Bookmark = module.export = mongoose.model('Bookmark', bookmark);