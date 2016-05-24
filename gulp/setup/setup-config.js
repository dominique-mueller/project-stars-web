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
 * Gulp task: Setup configuration files (at the moment for TypeKit and SystemJS)
 */
gulp.task( 'setup:config', () => {

	gutil.log( '> Setting up configurations ...' );

	return gulp
		.src( [
			`${ config.paths.project.base }/systemjs.config.js`,
			`${ config.paths.project.base }/typekit.config.js`
		] )
		.pipe( gulp.dest( config.paths.project.dest ) );

} );
