
//DEPENDENCIES
var os = require('os');
var fs = require('fs');
var https = require('https');
var express = require('express');
var app = express();
var router = require('./router.js');
require('./modules/connectDB.js');
var mongoose = require('mongoose');			
var bodyParser = require('body-parser');
var logger = require('./adapters/logger.js');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//###### REGISTER THE ROUTES ######
/*The order of app.use is very important
From the most specific sub url to the top url (DOMAIN/)
Otherwise, there will be unnecessary comparisons or even worth.
*/
app.use('/api/v1',router.Backend);
app.use('/', router.Frontend);
//for static file requests
app.use(express.static('public/assets'));


//#### START SERVER #####
//normal http server 
// var server = app.listen(3000, function(){
// 	var host = server.address().address;
// 	var port = server.address().port;

// 	logger.info('Example app listening at http://%s:%s', host, port);
// });

//https server. requires https for whole domain
https.createServer({
	key: fs.readFileSync('certs/key.pem'),
	cert: fs.readFileSync('certs/cert.pem')
}, app).listen(3000, function(){
	var host = this.address().address;
	var port = this.address().port;
	logger.info('Server is listening at http://%s:%s', host, port);
});
