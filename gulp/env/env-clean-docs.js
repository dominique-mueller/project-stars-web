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

/**
 * Gulp task: Clean documentation folder
 */
gulp.task( 'env:clean:docs', () => {
	return del( [
		`${ config.paths.docs.frontend }/**/*`,
		`${ config.paths.docs.backend }/**/*`
		] );
} );
