//###### SCHEMA DEFINITION ######
var mongoose = require('mongoose');

var user = new mongoose.Schema({
	firstName: {type: String, required: true},
	lastName: {type: String, required: true},
	emailAddress: {type: String, match: /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i, unique: true, required: true},
	password: {type: String, required: true},
	profileImage: String,
	registered: {type: Date, default: Date.now},
	connectedSocialServices:{
		facebook:{
			name: String
		}
	},
	connectedCloudServices:{
		dropbox:{
			name: String
		}
	}
});

var User = module.export = mongoose.model('User', user);
