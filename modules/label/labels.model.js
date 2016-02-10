var mongoose = require('mongoose');
var Label = require('../schemaExport').Label;
var user_id = require('../../adapters/authentication.js').getUser_Id;
var logger = '../../adapters/logger.js');

module.exports = {
	
	function create(data){
		var label = new Label();
		// ## the parameter check must not be nessecary, cause these functions are called from the middleware only
		// if(typeof data.name !== 'undefined' && data.name){
		label.name = data.name;
		label.owner = user_id;
		label.save(function(error){
			if(error){
				logger.error(error);
				if(error.name == 'ValidationError'){
					var message = require('../helpers/buildErrorMessage.js').validationError(error, label);
				}
			}
		});
		// }
	}

	function update(data){

	}

	function delete(data){

	}

	function findOne(data){

	}

	function findColor(){

	}

	function findAll(){

	}

}