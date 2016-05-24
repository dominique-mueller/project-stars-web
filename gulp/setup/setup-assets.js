'use strict';

/**
 * Import configuration
 */
const config = require( './../config.json' );

/**
 * Gulp imports
 */
const gulp = require( 'gulp' );
const gutil = require( 'gulp-util' );

/**
 * Gulp task: Setup all asssets (ath the moment onyl the login background image)
 */
gulp.task( 'setup:assets', () => {

	gutil.log( '> Copying static assets ...' );

	return gulp
		.src( `${ config.paths.assets.images }/*.jpg` )
		.pipe( gulp.dest( config.paths.assets.dest ) );

} );
