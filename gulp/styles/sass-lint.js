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
const scsslint = require( 'gulp-scss-lint' );

/**
 * Gulp task: Lint all SASS files
 */
gulp.task( 'sass:lint', () => {

	gutil.log( '> Linting SASS files ...' );

	return gulp
		.src( `${ config.paths.project.styles }/**/*.scss` )
		.pipe( scsslint() );
		// .pipe( scsslint.failReporter() ); // Possible, but maybe a bit to hard ...

} );
