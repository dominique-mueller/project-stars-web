'use strict';

/**
 * Import configuration
 */
const config = require( './../gulp.config.json' );

/**
 * Gulp imports
 */
const gulp = require( 'gulp-help' )( require( 'gulp' ) );

/**
 * Gulp task: Setup all asssets (ath the moment onyl the login background image)
 */
gulp.task( 'setup:assets', 'Setup static assets', () => {
	return gulp
		.src( `${ config.paths.assets.images }/*.jpg` )
		.pipe( gulp.dest( config.paths.assets.dest ) );
} );
