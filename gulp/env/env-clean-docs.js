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
gulp.task( 'docs:clean:docs', () => {

	gutil.log( '> Cleaning documentation files ...' );

	return del( `${ config.paths.docs.base }/**/*` );

} );
