var schemas = require('../modules/schemaExport.js');

module.exports = {
	getMongooseInputObject: function(schemaName, data){
		schema = schemas[schemaName];
	},
	getMongooseFindObject: function(schemaName, data){
		schema = schemas[schemaName];
	}
}

//get all paths
//get required paths
//make sure the required ones hava content data
//