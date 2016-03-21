var logger = require('./adapters/logger.js');
var httpStatus = require('./config.js').httpStatus;
var authentication = require('./adapters/authentication.js');
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
	logger.debug('REQ.BODY.testObject:: '+req.body.testObject);
	logger.debug('req.headers.authorization.Authorization: ' + req.headers.authorization);
	logger.debug('REQ.PARAM:: '+req.query.testParam);

	next();
});

//###### Frontend API ######

routerFrontend.get('',function(req, res){
	res.sendFile('public/assets/index.html', {root:__dirname});
});


//###### RestAPI ######

routerBackend.route('/authenticate/login')
	.post(function(req, res){
		var result = require('./adapters/authentication.js').login();
		result.then(function(){

		})
		.catch(function(){

		});
	});
routerBackend.route('/authenticate/logout')
	.delete(function(req, res){
		var result = require('./adapters/authentication.js').logout();
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
		require('./controller/usersController.js')(req, res).post();
	});


// do for all following backend requests
routerBackend.use(function(req, res, next) {
	//if the Authorization is set in the request header and this token is vaild (our token & not expired)
    var message = null;
    if(req.headers.authorization){
    	var result = sync.await(authentication.verifyToken(req.headers.authorization));
    	if(result === true){
    		next(); //continue with route matching
    	}
	    else{	//send access Forbidden message
	    	console.log(result);
	    	if(result.prototype.isPrototypeOf(Error) && result.name == 'TokenExpiredError'){
	    		message = 'Toked expired. Authentication failed.';
	    	}
	    }
    }
    if(!message){ //authentication failed but it is not a TokenExpiredError
    	message = 'Token authentication failed.';
    }
	res.status(httpStatus.UNAUTHORIZED).send(message);
	res.end();
});


routerBackend.route('/users')
	.get(function(req, res){
		require('./controller/usersController.js')(req, res).getAll();
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
		require('./controller.usersController.js')(req, res).get();
	})

	.put(function(req, res){
		require('./controller.usersController.js')(req, res).put();
	})

	.delete(function(req, res){
		require('./controller.usersController.js')(req, res).delete();
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
		var result = require('./modules/label/labels.model.js').findAll(authentication.getUserId(req.headers.authorization));
		result.then(function(labels){
			res.json({data:labels});
		})
		.catch(function(reason){
			res.send("FAILED")
		});
	})

	.post(function(req, res){
		var result = require('./modules/label/labels.model.js').create(req.body.data, authentication.getUserId(req.headers.authorization));
		result.then(function(label) {
			res.json({data:label});
		})
		.catch(function() {
			res.send("FAILED")
		});
	});
routerBackend.route('/labels/:label_id')
	.get(function(req, res){
		var result = require('./modules/label/labels.model.js').findOne(req.query._id);
		result.then(function(label){
			res.json({data:label});
		})
		.catch(function(reason){
			res.send("FAILED")
		});
		// res.send('Label GET id: ' + req.params.label_id);
	})

	.put(function(req, res){
		var result = require('./modules/label/labels.model.js').update(req.body.data);
		result.then(function(){
			res.end();
		})
		.catch(function(reason){
			res.send("FAILED")
		});
	})

	.delete(function(req, res){
		var result = require('./modules/label/labels.model.js').delete(req.body.data._id);
		result.then(function(msg){
			res.end();
		})
		.catch(function(reason){
			res.status(httpStatus.INVALID_INPUT).send("FAILED")
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