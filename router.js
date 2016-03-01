var logger = require('./adapters/logger.js');
var httpSta
tus = require('./config.js').httpStatus;
var authentication = require('./adapters/authentication.js');
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

routerBackend.route('/users/register')
	.post(function(req, res){

	});


// do for all following backend requests
routerBackend.use(function(req, res, next) {
    //TODO: verify token
    next(); //continue with route matching
});


routerBackend.route('/users')
	.get(function(req, res){
		res.send('User test GET');
	})

	.post(function(req, res){
		//Only an admin can use this route
		//use /api/vx/users/register for non admin user 
		
	});	
routerBackend.route('/users/:user_id')
	.get(function(req, res){
		res.send('User GET id: ' + req.params.user_id);
	})

	.put(function(req, res){

	})

	.delete(function(req, res){
		//Different functionalaty for admins and non-admins
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
		res.send('User GET id: ' + req.params.bookmark_id);
	})

	.put(function(req, res){

	})

	.delete(function(req, res){

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
		res.end(req.params.deviceId);
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
		res.send(req.params.settingId);
	})

	.put(function(req, res){

	})

	.delete(function(req, res){

	});


routerBackend.route('/labels')
	.get(function(req, res){
		var result = require('./modules/label/labels.model.js').findAll(authentication.getUserId());
		result.then(function(labels){
			res.json(labels);
		})
		.catch(function(reason){
			res.send("FAILED")
		});
	})

	.post(function(req, res){
		var result = require('./modules/label/labels.model.js').create(req.body, authentication.getUserId());
		result.then(function(label) {
			res.json(label);
		})
		.catch(function() {
			res.send("FAILED")
		});
	});
routerBackend.route('/labels/:label_id')
	.get(function(req, res){
		var result = require('./modules/label/labels.model.js').findOne(req.body.id);
		result.then(function(label){
			res.json(label);
		})
		.catch(function(reason){
			res.send("FAILED")
		});
		// res.send('Label GET id: ' + req.params.label_id);
	})

	.put(function(req, res){
		var result = require('./modules/label/labels.model.js').update(req.body);
		result.then(function(){
			res.end();
		})
		.catch(function(reason){
			res.send("FAILED")
		});
	})

	.delete(function(req, res){
		var result = require('./modules/label/labels.model.js').delete(req.body.id);
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