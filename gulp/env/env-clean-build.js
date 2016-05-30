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
 * Gulp task: Clean build folder
 */
gulp.task( 'env:clean:build', () => {
	return del( [
		`${ config.paths.project.dest }`,
		`${ config.paths.root }/index.html`
	] );
} );

/**
 * Gulp task: Clean temporary JS builds
 */
gulp.task( 'env:clean:tempbuild', () => {
	return del( `${ config.paths.project.dest }/temp` );
} );
