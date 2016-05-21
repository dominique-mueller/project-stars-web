
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
		return modifiedObject;
	}

}

function alterSingleObject(obj){
	//remove version field from object. It isn't needed anywhere
	object = JSON.parse(JSON.stringify(obj));
	//change the key _id to id because of convention
	object['id'] = object['_id'];
	delete object['_id'];
	return object;
}
