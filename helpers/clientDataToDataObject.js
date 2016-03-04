var schemas = require('../modules/schemaExport.js');

module.exports = {
	getMongooseInputObject: function(schemaName, data){
		var schema = schemas[schemaName];
		var inputData = {};
		var reqPaths = schema.requiredPaths;

		for(var i = 0, i < reqPaths.length, i++){
			if(data.hasOwnProperty(reqPaths[i])){
				inputData[reqPaths[i]] = data[reqPaths[i]];
			}
			else{
				throw new Error("required property is missing in data: " + reqPaths[i]);
			}
		}

		schema.eachPath(additionalInputData);
		/*
		get all required paths
		for reqPath.length
			try 
				inputData[reqPathIter] = data[reqPathIter]
			except
				return
		get all paths
		remove all required Paths from the whole list
		add all further data to input data
		*/
	},
	getMongooseFindObject: function(schemaName, data){
		schema = schemas[schemaName];
	}
}


function additionalInputData(pathName, type){

}
