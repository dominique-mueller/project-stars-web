
module.exports = {

	
	mongooseObjToFrontEndObj: function(object){
		var modifiedObject;
		if(Array.isArray(object)){
			modifiedObject = new Array();
			for(var i = 0; i < object.length; i++){
				modifiedObject.push(alterSingleObject(object[i]));
			}
		}
		else{
			modifiedObject = alterSingleObject(object);
		}
		console.log(JSON.stringify(modifiedObject));
		return modifiedObject;
	}

}

function alterSingleObject(obj){
	//remove version field from object. It isn't needed anywhere
	object = obj;
	console.log(delete object['__v']);
	console.log(object.__v);
	//change the key _id to id because of convention
	object['id'] = object['_id'];
	delete object['_id'];
	console.log("New Object for Frontend: " + JSON.stringify(object));
	return object;
}
