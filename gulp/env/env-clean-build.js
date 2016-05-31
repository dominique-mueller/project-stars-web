'use strict';

/**
 * Import configuration
 */
const gulpConfig = require( './../gulp.config.json' );

/**
 * Gulp imports
 */
const del 	= require( 'del' );
const gulp 	= require( 'gulp-help' )( require( 'gulp' ) );

/**
 * Gulp task: Clean build folder
 */
gulp.task( 'env:clean:build', 'Clean the build folder and all its content', () => {
	return del( [
		`${ gulpConfig.paths.project.dest }`,
		`${ gulpConfig.paths.root }/index.html`
	] );
} );

/**
 * Gulp task: Clean temporary JS builds
 */
gulp.task( 'env:clean:tempbuild', 'Clean the temporarily created build folder and all its content', () => {
	return del( `${ gulpConfig.paths.project.dest }/temp` );
} );
