//DEPENDENCIES
var os = require('os');
var fs = require('fs');
require('es6-promise').polyfill(); //over writes the node promises so they work like in the es6 specification
// web server requirements
var https = require('https');
var express = require('express');
var app = express(),
	redirectHTTP = express();
var router = require('./router.js');
var bodyParser = require('body-parser');
//database requirements
require('./modules/connectDB.js');
var mongoose = require('mongoose');			
//miscellaneous
var logger = require('./adapters/logger.js');

//over writes the mongoose promises so they work like in the es6 specification
// mongoose.Promise = require('es6-promise').Promise; 

//pass the body-parser to express
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//###### REGISTER THE ROUTES ######
/*The order of app.use is very important
From the most specific sub url to the top url (DOMAIN/)
Otherwise, there will be unnecessary comparisons or even worth.
*/
app.use('/api/v1',router.Backend);
//for static file requests
app.use('/build', express.static('build'));
app.use('/node_modules', express.static('node_modules'));
//non of the static files matches
//return index.html
app.use('/', router.Frontend);

redirectHTTP.use('/', router.Redirect);


//#### START SERVER #####

//https server. requires https for whole domain
https.createServer({
	key: fs.readFileSync('certs/key.pem'),
	cert: fs.readFileSync('certs/cert.pem'), 
	passphrase: 'stars-web'
}, app).listen(443, "localhost", function(){ //listen on https default port 443
	var host = this.address().address;
	var port = this.address().port;
	logger.info('Server is listening at http://%s:%s', host, port);
});

//Redirect http requests to https 
var http = require('http');
http.createServer(redirectHTTP).listen(80); //listen on http default port 80