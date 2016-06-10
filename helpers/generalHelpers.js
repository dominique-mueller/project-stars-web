var logger = require('../adapters/logger.js');
var httpStatus = require('../config.js').httpStatus;


module.exports = {
	mongooseObjToFrontEndObj: function(object){
		var modifiedObject;
		//change _id to id and remove __v
		if(Array.isArray(object)){
			modifiedObject = new Array();
			for(var i = 0; i < object.length; i++){
				modifiedObject.push(databaseDateToFrontEndDate(alterSingleObject(object[i])));
			}
		}
		else{
			modifiedObject = alterSingleObject(object);
			//cut of time from date
			modifiedObject = databaseDateToFrontEndDate(modifiedObject);
		}


		return modifiedObject;
	},

	respondWithError: function (message){
		return function(err){
			logger.error("respondeWithError: "  + message + " :: " + err);
			self.res.status(httpStatus.BAD_REQUEST)
			.json({'error':message});
		}
	}
}

function databaseDateToFrontEndDate(obj){
	var object = obj
	if(object.hasOwnProperty('created')){
		object.created = JSON.stringify(object.created).split('T')[0];
	}
	if(object.hasOwnProperty('updated')){
		object.updated = JSON.stringify(object.updated).split('T')[0];
	}
	return obj;
}


function alterSingleObject(obj){
	//remove version field from object. It isn't needed anywhere
	var object = JSON.parse(JSON.stringify(obj));
	// var object = JSON.parse(JSON.stringify(obj));
	//change the key _id to id because of convention
	object['id'] = object['_id'];
	delete object['_id'];
	delete object['__v'];
	return object;
}
