'use strict';

/**
 * Import configuration
 */
const config = require( './../config.json' );

/**
 * Gulp imports
 */
const gulp = require( 'gulp' );
const scsslint = require( 'gulp-scss-lint' );

/**
 * Gulp task: Lint all SASS files
 */
gulp.task( 'sass:lint', () => {
	return gulp
		.src( `${ config.paths.project.styles }/**/*.scss` )
		.pipe( scsslint() )
		.pipe( scsslint.failReporter() );
} );
