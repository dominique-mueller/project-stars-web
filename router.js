var logger = require('./adapters/logger.js');
var authentication = require('./adapters/authentication.js');
var routerBackend = require('express').Router(), 
	routerFrontend = require('express').Router()
	routerHTTPRedirect = require('express').Router();

// middleware to use for all requests
routerFrontend.use(function(req, res, next) {
    logger.debug('A frontend request');
    next(); //continue with route matching
});
routerBackend.use(function(req, res, next) {
    logger.debug('A backend request');
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

routerBackend.all('', function(req, res, next){
	//api request on 'api/vX/'
	logger.debug('Universal api request print');
	next();
});


routerBackend.route('/users')
	.get(function(req, res){
		res.send('User test GET');
	})

	.post(function(req, res){
		res.send('User test POST');

		// var user = require('modules/users/users.model.js').createUser(req.body);

		// var bear = new Bear();      // create a new instance of the Bear model
  		// bear.name = req.body.name;  // set the bears name (comes from the request)

        //save the bear and check for errors
        // bear.save(function(err) {
        //     if (err)
        //         res.send(err);

        //     res.json({ message: 'Bear created!' });
        // }

	});	
routerBackend.route('/users/:user_id')
	.get(function(req, res){
		res.send('User GET id: ' + req.params.user_id);
	})

	.put(function(req, res){

	})

	.delete(function(req, res){

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


routerBackend.route('/labels')
	.get(function(req, res){
		var result = require('./modules/label/labels.model.js').findAll(authentication.getUserId());
		result.then(function(msg){
			res.send('Label test GET ' + msg);
		})
		.catch(function(reason){
			res.send("FAILED")
		});
	})

	.post(function(req, res){
		var result = require('./modules/label/labels.model.js').create(req.body);
		result.then(function() {
			
		})
		.catch(function() {
			
		});
	});
routerBackend.route('/labels/:label_id')
	.get(function(req, res){
		var result = require('./modules/label/labels.model.js').findOne(req.body.id);
		result.then(function(msg){

		})
		.catch(function(reason){

		});
		// res.send('Label GET id: ' + req.params.label_id);
	})

	.put(function(req, res){
		var result = require('./modules/label/labels.model.js').update(req.body);
		result.then(function(msg){

		})
		.catch(function(reason){

		});
	})

	.delete(function(req, res){
		var result = require('./modules/label/labels.model.js').delete(req.body.id);
		result.then(function(msg){

		})
		.catch(function(reason){

		});
	});


//##### HTTP Redirect #####
routerHTTPRedirect.route('/api/*').all(httpAPIRequest);

routerHTTPRedirect.route('/api/').all(httpAPIRequest);

routerHTTPRedirect.route('*').all(function(req, res){
	logger.debug('http standard redirect route');
	res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
    res.end();
});


function httpAPIRequest(req, res){
	res.status(403).send('Access Forbidden.' + 
		' Sir, if you are trying to hack this website, would you please be so kind to stop it.' +
		' With our sincere thanks: The website owner & team.');
}



//##### export the routerBackend and routerFrontend so it can be used by an express app #####
module.exports = {
	Backend: routerBackend,
	Frontend: routerFrontend,
	Redirect: routerHTTPRedirect
};  