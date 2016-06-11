/**
 * System JS configuration (for module loading)
 */
( function( window ) {

	// Tell SystemJS where to find modules
	var map = {

		// App
		'main': 		'/build',
		'app': 			'/build/services/app',
		'bookmark': 	'/build/services/bookmark',
		'folder': 		'/build/services/folder',
		'label': 		'/build/services/label',
		'ui': 			'/build/services/ui',
		'user': 		'/build/services/user',
		'shared': 		'/build/shared',

		// Libraries
		'@ngrx': 		'/node_modules/@ngrx',
		'@angular': 	'/node_modules/@angular',
		'angular2-jwt': '/node_modules/angular2-jwt',
		'immutable': 	'/node_modules/immutable/dist',
		'rxjs': 		'/node_modules/rxjs'

	};

	// Tell SystemJS which files should be loaded
	var packages = {

		// App
		'main': {
			defaultExtension: 'js',
			main: 'main.js'
		},
		'app': {
			defaultExtension: 'js',
			main: 'index.js'
		},
		'bookmark': {
			defaultExtension: 'js',
			main: 'index.js'
		},
		'folder': {
			defaultExtension: 'js',
			main: 'index.js'
		},
		'label': {
			defaultExtension: 'js',
			main: 'index.js'
		},
		'ui': {
			defaultExtension: 'js',
			main: 'index.js'
		},
		'user': {
			defaultExtension: 'js',
			main: 'index.js'
		},
		'shared': {
			defaultExtension: 'js',
			main: 'index.js'
		},

		// Libraries
		'@angular/common': {
			defaultExtension: 'js',
			main: 'index.js'
		},
		'@angular/compiler': {
			defaultExtension: 'js',
			main: 'index.js'
		},
		'@angular/core': {
			defaultExtension: 'js',
			main: 'index.js'
		},
		'@angular/http': {
			defaultExtension: 'js',
			main: 'index.js'
		},
		'@angular/platform-browser': {
			defaultExtension: 'js',
			main: 'index.js'
		},
		'@angular/platform-browser-dynamic': {
			defaultExtension: 'js',
			main: 'index.js'
		},
		'@angular/router': {
			defaultExtension: 'js',
			main: 'index.js'
		},
		'@ngrx/core': {
			defaultExtension: 'js',
			main: 'index.js'
		},
		'@ngrx/store': {
			defaultExtension: 'js',
			main: 'index.js'
		},
		'angular2-jwt': {
			defaultExtension: 'js',
			main: 'angular2-jwt.js'
		},
		'immutable': {
			defaultExtension: 'js',
			main: 'immutable.js'
		},
		'rxjs': {
			defaultExtension: 'js'
		}

	};

	// Configure SystemJS
	System.config( {
		map: map,
		packages: packages
	} );

	// Run SystemJS
	System.import( 'main' ).catch( function( error ) {
		console.error( error );
	} );

} )( this );
