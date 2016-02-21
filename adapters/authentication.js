// var jwt = require('jsonwebtoken');
var logger = require('./logger');
var config = require('../config.js');

var test = new require('../modules/schemaExport.js').User();

// #### Public Functions #### 
module.exports = {
	signIn: function(payload){
		

		// return jwt.sign(payload, config.jwt.secret);
	},
	getUserId: function(){
		return test._id;
	}
};


// #### Private Functions ####