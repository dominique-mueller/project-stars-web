var logger = require('./adapters/logger.js');
var httpStatus = require('./config.js').httpStatus;
var authenticationReq = require('./adapters/authentication.js');
var authentication;
var sync = require('synchronize');
var routerBackend = require('express').Router(), 
	routerFrontend = require('express').Router()
	routerHTTPRedirect = require('express').Router();

// middleware to use for all requests
routerFrontend.use(function(req, res, next) {
    logger.debug('A frontend request');
    next(); //continue with route matching
});
routerHTTPRedirect.use(function(req, res, next) {
    logger.debug('A HTTP request');
    next(); //continue with route matching
});


routerBackend.use(function(req, res, next){
	authentication = new authenticationReq();
// 	logger.debug('REQ.BODY.testObject:: '+req.body.testObject);
// 	logger.debug('req.headers.authorization.Authorization: ' + req.headers.authorization);
// 	logger.debug('REQ.PARAM:: '+req.query.testParam);
	next();
});

//###### Frontend API ######

routerFrontend.get('',function(req, res){
	res.sendFile('public/assets/index.html', {root:__dirname});
});


//###### RestAPI ######

routerBackend.route('/authenticate/login')
	.post(function(req, res){
		var result = authentication.login();
		result.then(function(){

		})
		.catch(function(){

		});
	});
routerBackend.route('/authenticate/logout')
	.delete(function(req, res){
		var result = authentication.logout();
		result.then(function(){
			
		})
		.catch(function(){

		});
	});

routerBackend.route('/authenticate/accountActivation')
	.get(function(req, res){
		//TODO
	});

routerBackend.route('/users/register')
	.post(function(req, res){
		require('./controller/usersController.js')(req, res, authentication).post();
	});


// do for all following backend requests
routerBackend.use(function(req, res, next) {
	// logger.debug('authenticatie the token');
	//if the Authorization is set in the request header and this token is vaild (our token & not expired)
    var message = null;
    if(req.headers.authorization){
    	// logger.debug('authorization header is set');
    	authentication.setToken(req.headers.authorization, function(err){
    		// logger.debug('in the callback function of authentication.setToken');
    		if(err){ //Everything in this if body is error handling and redirecting
    			logger.debug('setToken threw error');
    			if(err.name == 'TokenExpiredError'){
    				//TODO: Redirect + info message
    				message = 'Toked expired. Authentication failed.';
    				// res.redirect(httpStatus.PERMANENT_REDIRECT, 'https://stars-web.de/login');
    			}
    			else{
    				message = 'Token authentication failed.';
    			}
    			res.status(httpStatus.UNAUTHORIZED).send(message);
				res.end();
    		}
    		else{ //token is valid - not expired and from this website - 
    			logger.debug('authentication successful!' + authentication.isAdmin);
    			next(); //continue with route matching
    		}
    	});
    }

 //    var message = null;
 //    if(req.headers.authorization){
	// 	authentication.setToken(req.headers.authorization);
 //    	var result = authentication.tokenVerified;
 //    	if(result === true){
 //    		next(); //continue with route matching
 //    	}
	//     else{	//send access Forbidden message
	//     	console.log(result);
	//     	if(result.prototype.isPrototypeOf(Error) && result.name == 'TokenExpiredError'){
	//     		message = 'Toked expired. Authentication failed.';
	//     	}
	//     }
 //    }
 //    if(!message){ //authentication failed but it is not a TokenExpiredError
 //    	message = 'Token authentication failed.';
 //    }
	// res.status(httpStatus.UNAUTHORIZED).send(message);
	// res.end();
});


routerBackend.route('/users')
	.get(function(req, res){
		require('./controller/usersController.js')(req, res, authentication).getAll();
	})

	.post(function(req, res){
		//Only an admin can use this route
		//use /api/vx/users/register for non admin user 
		
	});	
routerBackend.route('/users/:user_id')
	.get(function(req, res){
		//Possible value for :user_id is 'tokenUserId', which takes the userId from the authToken
		// if(req.params._id == 'tokenUserId'){
		// 	//TODO Code Review
		// 	require('./modules/user/users.model.js').findOne(
		// 		require('./helpers/generalHelpers.js').waitForUserIdFromPromise(
		// 			authentication.getUserId(req.headers.authorization)
		// 		)
		// 	);
		// }
		// else{

		// }
		// res.send('User GET id: ' + req.params._id);
		require('./controller.usersController.js')(req, res, authentication).get();
	})

	.put(function(req, res){
		require('./controller.usersController.js')(req, res, authentication).put();
	})

	.delete(function(req, res){
		require('./controller.usersController.js')(req, res, authentication).delete();
	});


routerBackend.route('/bookmarks')
	.get(function(req, res){
		res.send('Bookmarks test GET');
	})

	.post(function(req, res){
		res.send('Bookmark test POST');
	});
routerBackend.route('/bookmarks/:bookmark_id')
	.get(function(req, res){
		res.send('User GET id: ' + req.query._id);
	})

	.put(function(req, res){

	})

	.delete(function(req, res){

	});
routerBackend.route('/bookmarks/folders')
	.get(function(req, res){

	});

routerBackend.route('/folders')
	.get(function(req, res){
		
	})

	.post(function(req, res){
		
	});
routerBackend.route('/folders/:folder_id')
	.get(function(req, res){
		
	})

	.put(function(req, res){

	})

	.delete(function(req, res){

	});
routerBackend.route('/folders/bookmarks')
	.get(function(req, res){

	});


routerBackend.route('/devices')
	.get(function(req, res){
		res.end();
	})

	.post(function(req, res){
		res.end();
	});
routerBackend.route('/devices/:device_id')
	.get(function(req, res){
		res.end(req.query._id);
	})

	.put(function(req, res){

	})

	.delete(function(req, res){

	});


routerBackend.route('/settings')
	.get(function(req, res){
		res.end();
	})

	.post(function(req, res){
		res.end();
	});
routerBackend.route('/settings/:setting_id')
	.get(function(req, res){
		res.send(req.query._id);
	})

	.put(function(req, res){

	})

	.delete(function(req, res){
		
	});


routerBackend.route('/labels')
	.get(function(req, res){
		logger.debug('/labels request');
		var result = require('./modules/label/labels.model.js').findAll(authentication.tokenUserId);
		result.then(function(labels){
			res.json({data:labels});
			res.end();
		})
		.catch(function(reason){
			res.send('{"error":"Failed to get Labels"}');
		});
	})

	.post(function(req, res){
		// var data = JSON.parse(req.body.data);
		// logger.debug('REQ.BODY: ' + req.body.data + ' :: data.name: ' + data.name);
		logger.debug('CREATE LABEL userId: ' + authentication.tokenUserId)
		var result = require('./modules/label/labels.model.js').create(JSON.parse(req.body.data), authentication.tokenUserId);
		result.then(function(label) {
			res.json({data:label});
			res.end();
		})
		.catch(function() {
			res.send('{"error":"Failed to create Label"}');
		});
	});
routerBackend.route('/labels/:label_id')
	.get(function(req, res){
		var result = require('./modules/label/labels.model.js').findOne(req.query._id);
		result.then(function(label){
			res.json({data:label});
			res.end();
		})
		.catch(function(reason){
			res.send('{"error":"Failed to get Label"}');
		});
		// res.send('Label GET id: ' + req.params.label_id);
	})

	.put(function(req, res){
		var result = require('./modules/label/labels.model.js').update(JSON.parse(req.body.data));
		result.then(function(){
			res.status(httpStatus.NO_CONTENT);
			res.end();
		})
		.catch(function(reason){
			res.send('{"error":"Failed to update Label"}');
		});
	})

	.delete(function(req, res){
		var result = require('./modules/label/labels.model.js').delete(JSON.parse(req.body.data)._id);
		result.then(function(msg){
			res.end();
		})
		.catch(function(reason){
			res.status(httpStatus.INVALID_INPUT).send('{"error":"Failed to delete Label"}');
		});
	});


//##### HTTP Redirect #####
routerHTTPRedirect.route('/api/*').all(httpAPIRequest);

routerHTTPRedirect.route('/api/').all(httpAPIRequest);

routerHTTPRedirect.route('*').all(function(req, res){
	logger.debug('http standard redirect route');
    res.redirect(httpStatus.PERMANENT_REDIRECT, 'https://' + req.headers.authorization['host'] + req.url);
});


function httpAPIRequest(req, res){
	res.status(httpStatus.FORBIDDEN).send('Access Forbidden.' + 
		' Sir, if you are trying to hack this website, would you please be so kind to stop it.' +
		' With our sincere thanks: The website owner & team.');
}



//##### export the routerBackend and routerFrontend so it can be used by an express app #####
module.exports = {
	Backend: routerBackend,
	Frontend: routerFrontend,
	Redirect: routerHTTPRedirect
};  