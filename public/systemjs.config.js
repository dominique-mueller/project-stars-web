( function( window ) {

	// Tell SystemJS where to find modules
	var map = {

		// App
		'app': 			'/build',

		// Libraries
		'@ngrx/store': 	'/node_modules/@ngrx/store',
		'@angular': 	'/node_modules/@angular',
		'immutable': 	'/node_modules/immutable/dist',
		'rxjs': 		'/node_modules/rxjs'

	};

	// Tell SystemHS which files to actually load
	var packages = {

		// App
		'app': {
			defaultExtension: 'js',
			main: 'main.js'
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
		'@ngrx/store': {
			defaultExtension: 'js',
			main: 'index.js'
		},
		rxjs: {
			defaultExtension: 'js'
		},
		immutable: {
			defaultExtension: 'js',
			main: 'immutable.js'
		}

	};

	// Configure SystemJS
	System.config( {
		map: map,
		packages: packages
	} );

} )( this );
