/*
LOAD ALL SCHEMAS & MODELS
This makes it possible for other modules to use the ODM models
*/
module.exports = {
	 "Device": require('./device/device.schema.js'),
	 "Setting": require('./setting/setting.schema.js'),
	 "Label": require('./label/label.schema.js'),
	 "Bookmark": require('./bookmark/bookmark.schema.js'),
	 "User": require('./user/user.schema.js'),
	 "Session": require('./session/session.schema.js')
};


/*
How to use in other files:
	var mongoose = require( 'mongoose' ),  
    var DBModules = require( '/modules/connectDB.js' ); 
*/