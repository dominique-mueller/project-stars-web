'use strict';

/**
 * Import configuration
 */
const config = require( './../config.json' );

/**
 * Gulp imports
 */
const browserSync = require( 'browser-sync' );
const gulp = require( 'gulp' );
const inject = require( 'gulp-inject' );
const inlinesource = require( 'gulp-inline-source' );
const rename = require( 'gulp-rename' );
const svgstore = require( 'gulp-svgstore' );

/**
 * Gulp task: Setup index file
 */
gulp.task( 'setup:index', () => {

	// First up, get all SVG icons, prefix them and put them in the store
	let svgString = gulp
		.src( `${ config.paths.assets.icons }/*.svg` )
		.pipe( rename( {
			prefix: 'icon-'
		} ) )
		.pipe( svgstore( {
			inlineSvg: true
		} ) );

	// Then, inject SVG and JavaScript into the index file
	return gulp
		.src( `${ config.paths.project.base }/${ config.names.index }` )
		.pipe( inlinesource( { // Inline JavaScript files
			compress: true
		} ) )
		.pipe( inject( svgString, { // Inject SVG Icons into the page
			transform: ( path, file ) => {
				return file.contents.toString();
			}
		} ) )
		.pipe( gulp.dest( config.paths.root ) )
		.pipe( browserSync.stream( { once: true } ) );

} );
