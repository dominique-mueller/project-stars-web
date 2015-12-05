
//DEPENDENCIES
var os = require('os');
var fs = require('fs');
var express = require('express');
var app = express();
require('./modules/connectDB.js');
var mongoose = require('mongoose');			
var bodyParser = require('body-parser');
var bunyan = require('bunyan');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//checking the OS to determine the log file path
var logPath;
if(os.platform() === 'linux'){
	logPath = '/var/log/bookmarkHQ/';
	if(!fs.lstatSync(logPath).isDirectory()){
		fs.mkdirSynch(logPath);
	}
}
else{

}

var log = bunyan.createLogger({name:'mainLog'});

var router = express.Router();
// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging (e.g. request IP)
    console.log('A Request');
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
	console.log('Universial api request print');
	next();
});


router.route('/users')
	.get(function(req, res){
		res.send('User test GET');
	})

	.post(function(req, res){
		res.send('User test POST');
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


//###### REGISTER THE ROUTES ######
/*The order of app.use is very important
From the most specific sub url to the top url (DOMAIN/)
Otherwise, there will be unnecessary comparisons or even worth.
*/
app.use('/api/v1',router);
app.use('/', router);
//for static file requests
app.use(express.static('public/assets'));

//#### START SERVER #####
var server = app.listen(3000, function(){
	var host = server.address().address;
	var port = server.address().port;

	console.log('Example app listening at http://%s:%s', host, port);
});


