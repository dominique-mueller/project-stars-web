'use strict';

/**
 * Import configuration
 */
const config = require( './../gulp.config.json' );

/**
 * Gulp imports
 */
const del = require( 'del' );
const gulp = require( 'gulp-help' )( require( 'gulp' ) );

/**
 * Gulp task: Clean documentation folder
 */
gulp.task( 'env:clean:docs', 'Clean documentation folder', () => {
	return del( [
		`${ config.paths.docs.frontend }/**/*`,
		`${ config.paths.docs.backend }/**/*`
		] );
} );
