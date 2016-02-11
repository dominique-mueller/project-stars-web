var logger = require('./adapters/logger.js');
var routerBackend = require('express').Router(), routerFrontend = require('express').Router();

// middleware to use for all requests
routerFrontend.use(function(req, res, next) {
    logger.debug('A frontend request');
    next(); //continue with route matching
});
routerBackend.use(function(req, res, next) {
    logger.debug('A backend request');
    next(); //continue with route matching
});


//###### Frontend API ######

routerFrontend.get('',function(req, res){
	res.send('Hello World!');
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
		require('./modules/label/labels.model.js').findAll(function(result){
			res.send('Label test GET ' + result );
		});
	})

	.post(function(req, res){
		require('./modules/label/labels.model.js').create(req.body, function(result){
			if(typeof result == 'undefined' && !result){
				//if result is NOT set
			}
			else{
				//if result is set
				res.send('Label test POST' + String(result));
			}
		});
	});
routerBackend.route('/labels/:label_id')
	.get(function(req, res){
		res.send('Label GET id: ' + req.params.label_id);
	})

	.put(function(req, res){

	})

	.delete(function(req, res){

	});
// routerBackend.route('/labels/colors/:color')
// 	.get(function(req, res){
		
// 		res.send('GET all Labels with color: ' + req.params.color);
// 	});


//##### export the routerBackend and routerFrontend so it can be used by an express app #####
module.exports = {
	'Backend': routerBackend,
	'Frontend': routerFrontend
};