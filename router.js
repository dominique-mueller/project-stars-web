var logger = require('./adapters/logger.js');
var httpStatus = require('./config.js').httpStatus;
var authentication;
var helpers = require('./helpers/generalHelpers.js');
var routerBackend = require('express').Router(), 
	routerFrontend = require('express').Router(),
	routerHTTPRedirect = require('express').Router();
var usersController, bookmarksController, foldersController, labelsController;


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
	//a new Authentication object has to be created here, because it only is for this request
	logger.debug("REQUEST: " + req.body.data);
	var a = require('./adapters/authentication.js');
	authentication = new a();
	next();
});


//###### Frontend API ######

/*
this router will route every request to the index.html in the project root folder
the frontend router is the last router who is checked for url matching. @see app.js 
*/
routerFrontend.route('*').all(function(req, res){
	res.sendFile('index.html', {root:__dirname});
	// res.end();
});


//###### RestAPI ######

routerBackend.route('/authenticate/login')
	.post(function(req, res){
		logger.debug('LOGIN:: ' + req);
		var result = authentication.login(req.body.data);
		// var result = authentication.login(JSON.parse(req.body.data));
		result.then(function(token){
			logger.debug('resolve JWT::' + token);
			res.status(httpStatus.OK).json({data:token});
			res.end();
		})
		.catch(function(err){
			logger.debug('Login error');
			res.status(httpStatus.INVALID_INPUT).json({error:err});
			res.end();
		});
	});
routerBackend.route('/authenticate/logout')
	.delete(function(req, res){
		res.status(httpStatus.NO_CONTENT).end();
	});

routerBackend.route('/authenticate/accountActivation')
	.get(function(req, res){
		//TODO
	});
routerBackend.route('/authenticate/newEMailAddress')
	.get(function(req, res){
		//TODO
		// get request with authentication token
		// will be handled like an account activation
	});

routerBackend.use('/users', function(req, res, next){
	var u = require('./controller/usersController.js');
	usersController = new u(req, res, authentication);
	next();
});
routerBackend.route('/users/register')
	.post(function(req, res){
		usersController.post();
	});

// Backend authorization
// do for all following backend requests
routerBackend.use(function(req, res, next) {
	//if the Authorization is set in the request header and this token is vaild (our token & not expired)
    var message = null;
    if(req.headers.authorization){
    	authentication.setToken(req.headers.authorization.split(" ")[1], function(err){ //split because of authorization header prefix
    		if(err){ //Everything in this if body is error handling and redirecting
    			logger.debug('authentication failed. Error: ' + err);
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
    			logger.debug('authentication successful. Is the req  admin? ' + authentication.isAdmin);
    			next(); //continue with route matching
    		}
    	});
    }
    else{
    	logger.debug('no Authorization in req header');
    	res.status(httpStatus.UNAUTHORIZED).send('Token authentication failed.');
    }
});


routerBackend.route('/users')
	.get(function(req, res){
		usersController.getAll();
	})

	.post(function(req, res){
		//Only an admin can use this route
		//use /api/vx/users/register for non admin user 
		if(authentication.isAdmin){
			usersController.post();
		}
		else{
			res.status(httpStatus.FORBIDDEN).json({error:'This route is only for the stars-web admins available!'}).end();
		}
	});	
routerBackend.route('/users/:user_id')
	.get(function(req, res){
		usersController.get();
	})

	.put(function(req, res){
		usersController.put();
	})

	.delete(function(req, res){
		usersController.delete();
	});

routerBackend.use('/bookmarks', function(req, res, next){
	var b = require('./controller/bookmarksController.js');
	bookmarksController = new b(req, res, authentication);
	next();
});
routerBackend.route('/bookmarks')
	.get(function(req, res){
		bookmarksController.getAll();
	})

	.post(function(req, res){
		bookmarksController.post();
	});
routerBackend.route('/bookmarks/:bookmark_id')
	.get(function(req, res){
		bookmarksController.get();
	})

	.put(function(req, res){
		bookmarksController.put();
	})

	.delete(function(req, res){
		bookmarksController.delete();
	});
routerBackend.route('/bookmarks/folders')
	.get(function(req, res){
		res.end();
	});
// routerBackend.route('bookmarks/user/:user_id')
// 	.get(function(req, res){
// 		bookmarksController.getAll(true);
// 	});

routerBackend.use('/folders', function(req, res, next){
	var f = require('./controller/foldersController.js');
	foldersController = new f(req, res, authentication);
	next();
});
routerBackend.route('/folders')
	.get(function(req, res){
		foldersController.getAll();
	})

	.post(function(req, res){
		foldersController.post();
	});
routerBackend.route('/folders/:folder_id')
	.get(function(req, res){
		foldersController.get();
	})

	.put(function(req, res){
		foldersController.put();
	})

	.delete(function(req, res){
		foldersController.delete();
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


routerBackend.use('/labels', function(req, res, next){
	var l = require('./controller/labelsController.js');
	labelsController = new l(req, res, authentication);
	next();
});

routerBackend.route('/labels')
	.get(function(req, res){
		labelsController.getAll();
	})

	.post(function(req, res){
		labelsController.post();
	});
routerBackend.route('/labels/:label_id')
	.get(function(req, res){
		labelsController.get();
	})

	.put(function(req, res){
		labelsController.put();
	})

	.delete(function(req, res){
		labelsController.delete();
	});




//##### HTTP Redirect #####
routerHTTPRedirect.route('/api/*').all(httpAPIRequest);

routerHTTPRedirect.route('/api/').all(httpAPIRequest);

routerHTTPRedirect.route('*').all(function(req, res){
	logger.debug('http standard redirect route');
    res.redirect(httpStatus.PERMANENT_REDIRECT, 'https://' + req.headers['host'] + req.url);
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
