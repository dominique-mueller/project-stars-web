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
gulp.task( 'docs:clean:docs', () => {
	return del( `${ config.paths.docs.base }/**/*` );
} );
