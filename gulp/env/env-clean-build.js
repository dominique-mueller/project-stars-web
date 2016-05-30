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
 * Gulp task: Clean build folder
 */
gulp.task( 'env:clean:build', 'Clean build folder', () => {
	return del( [
		`${ config.paths.project.dest }`,
		`${ config.paths.root }/index.html`
	] );
} );

/**
 * Gulp task: Clean temporary JS builds
 */
gulp.task( 'env:clean:tempbuild', 'Clean temporary build folder', () => {
	return del( `${ config.paths.project.dest }/temp` );
} );
