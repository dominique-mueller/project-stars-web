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
 * Gulp task: Setup configuration files (at the moment for TypeKit and SystemJS)
 */
gulp.task( 'setup:config', 'Setup configuration files', () => {
	return gulp
		.src( [
			`${ config.paths.project.base }/systemjs.config.js`,
			`${ config.paths.project.base }/typekit.config.js`
		] )
		.pipe( gulp.dest( config.paths.project.dest ) );
} );
