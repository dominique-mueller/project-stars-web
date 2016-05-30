'use strict';

/**
 * Import configuration
 */
const config = require( './../config.json' );

/**
 * Gulp imports
 */
const del = require( 'del' );
const gulp = require( 'gulp' );
const gutil = require( 'gulp-util' );

/**
 * Gulp task: Clean documentation folder
 */
gulp.task( 'env:clean:docs', () => {

	gutil.log( '> Cleaning documentation files ...' );

	return del( [
		`${ config.paths.docs.frontend }/**/*`,
		`${ config.paths.docs.backend }/**/*`
		] );

} );
