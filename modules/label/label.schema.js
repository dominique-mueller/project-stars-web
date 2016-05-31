//###### SCHEMA DEFINITION ######
var mongoose = require('mongoose');

var label = new mongoose.Schema({
	name: {type: String, minlength:3, maxlength: 256, required: true},
	color: {type: String, match:/#?[A-F0-9][A-F0-9][A-F0-9](?:[A-F0-9][A-F0-9][A-F0-9])?/, default:"#FFF"},
	owner: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true}
});

var Label = module.exports = mongoose.model('Label', label);

