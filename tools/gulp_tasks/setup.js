'use strict';

/**
 * Import configurations
 */
const config = require( './config.json' );

/**
 * Gulp imports
 */
const browserSync = require( 'browser-sync' );
const gulp = require( 'gulp' );
const inject = require( 'gulp-inject' );
const rename = require( 'gulp-rename' );
const svgstore = require( 'gulp-svgstore' );

/**
 * Gulp task: Setup index file
 */
gulp.task( 'setup:index', () => {

	// First up, get all SVG icons, prefix them and put them in the store
	const svgString = gulp
		.src( `${ config.paths.assets.icons }/*.svg` )
		.pipe( rename( { prefix: 'icon-' } ) )
		.pipe( svgstore( {
			inlineSvg: true
		} ) );

	// Second, inject the SVG into he index file
	return gulp
		.src( `${ config.paths.project.src }/index.html` )
		.pipe( inject( svgString, { transform: ( path, file ) => {
			return file.contents.toString();
		} } ) )
		.pipe( gulp.dest( config.paths.root ) )
		.pipe( browserSync.stream( { once: true } ) );

} );

/**
 * Gulp task: Setup SystemJS
 */
gulp.task( 'setup:systemjs', () => {
	return gulp
		.src( `${ config.paths.project.src }/systemjs.config.js` )
		.pipe( gulp.dest( config.paths.app.dest ) );
} );

/**
 * Gulp task: Copy assets (e.g. images)
 */
gulp.task( 'setup:assets', () => {

	// Copy all assets (for now just images)
	return gulp
		.src( `${ config.paths.assets.images }/*.jpg` )
		.pipe( gulp.dest( config.paths.assets.dest ) );

} );

/**
 * Gulp task: Setup temp API mock data (for dev only)
 * TODO: Remove me
 */
gulp.task( 'setup:apimock', () => {

	// Copy JSON data mock files
	return gulp
		.src( [
			`${ config.paths.app.src }/services/bookmark/bookmarks.mock.json`,
			`${ config.paths.app.src }/services/folder/folders.mock.json`,
			`${ config.paths.app.src }/services/label/labels.mock.json`,
			`${ config.paths.app.src }/services/user/user.mock.json`,
			`${ config.paths.app.src }/services/user/jwt.mock.json`
		] )
		.pipe( gulp.dest( config.paths.app.apimock ) );

} );
