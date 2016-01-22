var logger = require('./adapters/logger.js');
var router = require('express').Router();

// middleware to use for all requests
router.use(function(req, res, next) {
    logger.info('A request');
    next(); // make sure we go to the next routes and don't stop here
});


//###### Frontend API ######

router.get('',function(req, res){
	res.send('Hello World!');
});


//###### RestAPI ######


// router.param(':user_id', function(req, res, next, id){
// 	req.user = require(MODELS_PATH +'user.js').;
// });
router.all('', function(req, res, next){
	logger.info('Universial api request print');
	next();
});


router.route('/users')
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
router.route('/users/:user_id')
	.get(function(req, res){
		res.send('User GET id: ' + req.params.user_id);
	})

	.put(function(req, res){

	})

	.delete(function(req, res){

	});


router.route('/bookmarks')
	.get(function(req, res){
		res.send('Bookḿarks test GET');
	})

	.post(function(req, res){
		res.send('Bookmark test POST');
	});
router.route('/bookmarks/:bookmark_id')
	.get(function(req, res){
		res.send('User GET id: ' + req.params.bookmark_id);
	})

	.put(function(req, res){

	})

	.delete(function(req, res){

	});


router.route('/labels')
	.get(function(req, res){
		res.send('Label test GET');
	})

	.post(function(req, res){
		res.send('Label test POST');
	});
router.route('/labels/:label_id')
	.get(function(req, res){
		res.send('Label GET id: ' + req.params.label_id);
	})

	.put(function(req, res){

	})

	.delete(function(req, res){

	});


//##### export the router so it can be used by an express app #####
module.exports = router;