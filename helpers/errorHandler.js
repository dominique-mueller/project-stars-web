var logger = require('../adapters/logger.js');

// #### DEFAULT MESSAGES ####
var defaultErrorMsg = 'Action failed due to an unknown problem. Please try again later or contact the support.';
var defaultValidateMsg = "Action failed, because some inputValue parameter are not valid. The invalid parameter(s) can't be specified.";


module.exports = {
	handleMongooseError: function(error, definedSchema){
		var errorMessage = defaultErrorMsg;
		logger.error(error);

		if(error.name == 'ValidationError'){
			errorMessage = validationError(error, definedSchema);
		}
		return errorMessage;
	}
}


function validationError(error, definedSchema){
	var errorMessage = defaultValidateMsg;
	// matchinputValueAndSchemaField = error.message.match(/`(.+?)`.*?(`(.+?)`)+?/),
	// schemaField = null,
	// inputValue;

	// if(definedSchema.schema.paths.hasOwnProperty(matchinputValueAndSchemaField[1])){
	// 	schemaField = 1;
	// 	inputValue = 3;
	// }
	// else if(definedSchema.schema.paths.hasOwnProperty(matchinputValueAndSchemaField[3])){
	// 	schemaField = 3;
	// 	inputValue = 1;
	// }

	// if(!(schemaField == null)){
	// 	errorMessage = 'Invalid inputValue data: The inputValue value "'
	// 		+ matchinputValueAndSchemaField[inputValue] 
	// 		+ '" is not valid for the field "' + matchinputValueAndSchemaField[schemaField]
	// 		+ '" in "' + definedSchema.modelName + '".';
	// }
	return errorMessage;
};