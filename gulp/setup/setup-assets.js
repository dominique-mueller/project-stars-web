'use strict';

/**
 * Import configuration
 */
const gulpConfig = require( './../gulp.config.json' );

/**
 * Gulp imports
 */
const gulp = require( 'gulp-help' )( require( 'gulp' ) );

/**
 * Gulp task: Setup all asssets (ath the moment onyl the login background image)
 */
gulp.task( 'setup:assets', 'Setup static assets', () => {
	return gulp
		.src( `${ gulpConfig.paths.assets.images }/*.jpg` )
		.pipe( gulp.dest( gulpConfig.paths.assets.dest ) );
} );
