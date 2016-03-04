// this module not only contains configuration data, but also constants

module.exports = {
	database:{
		url: 'mongodb://localhost/',
		database: 'dev'
	},
	authentication:{
		secret: 'Why, now, blow wind, swell billow and swim bark! The storm is up and all is on the hazard!'
	},
	httpStatus: {
		OK: 				200, 	//Default 2xx Response
		CREATED: 			201, 	//POST and PUT reponse status
		ACCEPTED: 			202,	//
		NO_CONTENT: 		204,	//For example a "last_used" update
		MOVED_PERMANENTLY: 	301,	//URL not valid anymore. 
		FOUND: 				302,	//
		TEMPORARY_REDIRECT: 307,	//
		PERMANENT_REDIRECT: 308, 	//URL not valid anymore. Use same method
		BAD_REQUEST: 		400, 	//Default 4xx Response
		UNAUTHORIZED: 		401, 	//
		FORBIEDDEN:  		403,	//
		NOT_FOUND: 			404, 	//
		GONE: 				410, 	//The requested resource is deleted
		INVALID_INPUT: 		419,	//SELF DEFINED: The user input is invalid
		SERVER_ERROR: 		500
	}
}