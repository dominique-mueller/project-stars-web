//###### SCHEMA DEFINITION ######
var mongoose = require('mongoose');

var user = new mongoose.Schema({
	firstName: {type: String, required: true},
	lastName: {type: String, required: true},
	emailAddress: {type: String, match: /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i, unique: true, required: true},
	password: {type: String, required: true},
	admin: {type: Boolean, default: false},
	profileImage: String,
	registered: {type: Date, default: Date.now},
	accountActivation: {
		token: {type: String, required: true},
		tempPassword: {type: String, required: true}, //used for password reset or when an admin created an account
		activationState: {type: Boolean, default: false},
		deletionDate: {type: Date}
	},
	connectedSocialServices:{
		facebook:{
			name: String
		}
	},
	connectedCloudServices:{
		dropbox:{
			name: String
		}
	},
	settings:{
		storage:[]
	}
});

var User = module.exports = mongoose.model('User', user);
