/*
LOAD ALL SCHEMAS
This makes it possible for other modules to use the ODM models
*/
module.exports = {
	 "Device": require('./device/device.schema.js'),
	 "Label": require('./label/label.schema.js'),
	 "Folder": require('./folder/folder.schema.js'),
	 "Bookmark": require('./bookmark/bookmark.schema.js'),
	 "User": require('./user/user.schema.js')
};


/*
How to use in other files:
	var mongoose = require( 'mongoose' ),  
    var DBModules = require( '/modules/connectDB.js' ); 
*/