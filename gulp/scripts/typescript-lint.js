'use strict';

/**
 * Import configuration
 */
const config = require( './../config.json' );

/**
 * Gulp imports
 */
const gulp = require( 'gulp' );
const tslint = require( 'gulp-tslint' );

/**
 * Gulp task: Lint all TypeScript files, including the Angular 2 styleguide rules
 */
gulp.task( 'typescript:lint', () => {
	return gulp
		.src( `${ config.paths.project.scripts }/**/*.ts` )
		.pipe( tslint() )
		.pipe( tslint.report( 'verbose' ) );
} );
