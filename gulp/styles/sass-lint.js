'use strict';

/**
 * Import configuration
 */
const gulpConfig = require( './../gulp.config.json' );

/**
 * Gulp imports
 */
const gulp 		= require( 'gulp-help' )( require( 'gulp' ) );
const sassLint 	= require( 'gulp-sass-lint' );

/**
 * Gulp task: Lint all SASS files
 */
gulp.task( 'sass:lint', 'Lint SASS (SASSLint)', () => {
	return gulp
		.src( `${ gulpConfig.paths.project.styles }/**/*.scss` )
		.pipe( sassLint( {
			configFile: './../../.sass-lint.yml'
		} ) )
		.pipe( sassLint.format() ); // Pretty print result
		// .pipe( sassLint.failOnError() ); // A bit to harsh to exit here
} );
