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
const sassLint = require( 'gulp-sass-lint' );

/**
 * Gulp task: Lint all SASS files
 */
gulp.task( 'sass:lint', () => {

	gutil.log( '> Linting SASS files ...' );

	return gulp
		.src( `${ config.paths.project.styles }/**/*.scss` )
		.pipe( sassLint( {
			configFile: './../../.sass-lint.yml'
		} ) )
		.pipe( sassLint.format() ); // Pretty print result
		// .pipe( sassLint.failOnError() ); // A bit to harsh to exit here

} );
