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
 * Gulp task: Setup configuration files (at the moment for TypeKit and SystemJS)
 */
gulp.task( 'setup:config', 'Setup configuration files', () => {
	return gulp
		.src( [
			`${ gulpConfig.paths.project.base }/systemjs.config.js`,
			`${ gulpConfig.paths.project.base }/typekit.config.js`
		] )
		.pipe( gulp.dest( gulpConfig.paths.project.dest ) );
} );
