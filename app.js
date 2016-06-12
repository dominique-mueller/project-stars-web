// ##### SETUP #####

// Basic cependencies
var os = require( 'os' );
var fs = require( 'fs' );
var logger = require( './adapters/logger.js' );
require( 'es6-promise' ).polyfill(); // Overwrites the node promises so they work like in the ES6 specification

// Web server dependencies
var http = require( 'http' );
var https = require( 'https' );
var express = require( 'express' );
var app = express(),
	redirectHTTP = express();
var router = require( './router.js' );
var bodyParser = require( 'body-parser' );

// Database depdendencies
require( './modules/connectDB.js' );
var mongoose = require( 'mongoose' );

// Pass the body-parser to express
app.use( bodyParser.urlencoded( { extended: true } ) );
app.use( bodyParser.json() );



// ##### REGISTER REST API ROUTES #####
// The order of app.use is very important
// From the most specific sub url to the top url (DOMAIN/)

// Backend REST API
app.use( '/api/v1', router.Backend );

// For static file requests (e.g. HTML, JavaScript, CSS, ...)
app.use( '/build', express.static( 'build' ) );
app.use( '/node_modules', express.static( 'node_modules' ) ); // For development only

// Fallback: always return the index.html
app.use( '/', router.Frontend );
redirectHTTP.use( '/', router.Redirect );



// ##### START WEB SERVER #####

// HTTPS server, https is required for the whole domain
https
	.createServer( {
		key: fs.readFileSync( 'certs/key.pem' ),
		cert: fs.readFileSync( 'certs/cert.pem' ), // Dev cert only
		passphrase: 'stars-web'
	}, app )
	.listen( 443, 'localhost', function() { //listen on https default port 443
		var host = this.address().address;
		var port = this.address().port;
		logger.info( 'Server is listening at http://%s:%s', host, port );
	} );

// Redirect HTTP requests to HTTPS automatically
http.createServer( redirectHTTP ).listen(80); //listen on http default port 80
