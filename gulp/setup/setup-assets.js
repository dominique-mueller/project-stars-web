'use strict';

/**
 * Import configuration
 */
const config = require( './../config.json' );

/**
 * Gulp imports
 */
const gulp = require( 'gulp' );

/**
 * Gulp task: Setup all asssets
 */
gulp.task( 'setup:assets', () => {
	return gulp
		.src( `${ config.paths.assets.images }/*.jpg` )
		.pipe( gulp.dest( config.paths.assets.dest ) );
} );
