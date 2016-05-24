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
 * Gulp task: Clean build folder
 */
gulp.task( 'env:clean:build', () => {

	gutil.log( '> Cleaning build files ...' );

	return del( [
		`${ config.paths.project.dest }`,
		`${ config.paths.root }/index.html`
	] );

} );

/**
 * Gulp task: Clean temporary JS builds
 */
gulp.task( 'env:clean:tempbuild', () => {

	gutil.log( '> Cleaning temporary build files ...' );

	return del( `${ config.paths.project.dest }/temp` );

} );
