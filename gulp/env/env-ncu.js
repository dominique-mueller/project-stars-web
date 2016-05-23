'use strict';

/**
 * Imports configuration
 */
const config = require( './../config.json' );

/**
 * Gulp imports
 */
const gulp = require( 'gulp' );
const gutil = require( 'gulp-util' );
const ncu = require( 'npm-check-updates' );

/**
 * Gulp task: Check for available NPM dependency updates / upgrades
 */
gulp.task( 'env:ncu', () => {
	ncu
		.run( {
			packageFile: `${ config.paths.root }/${ config.names.package }`
		} )
		.then( ( results ) => { // Pretty print the results
			if ( Object.keys( results ).length === 0 ) {
				gutil.log( 'Hooray! All NPM dependencies match the latest package version.' );
			} else {
				gutil.log( 'There are updates available for the following NPM packages:' );
				for ( let key in results ) {
					gutil.log( gutil.colors.blue( key ), '=>',
						gutil.colors.yellow( results[ key ] ), 'is available');
				}
			}
		} );
} );
