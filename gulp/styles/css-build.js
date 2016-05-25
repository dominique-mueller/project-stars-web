'use strict';

/**
 * Import configuration
 */
const config = require( './../config.json' );

/**
 * Gulp imports
 */
const autoprefixer = require( 'gulp-autoprefixer' );
const browserSync = require( 'browser-sync' );
const cssmin = require( 'gulp-cssmin' );
const gulp = require( 'gulp' );
const gutil = require( 'gulp-util' );
const rename = require( 'gulp-rename' );

/**
 * Gulp task: Build inline CSS file (for development)
 */
gulp.task( 'css:build--dev', () => {

	gutil.log( '> Building inline CSS file (DEV) ...' );

	return gulp
		.src( `${ config.paths.project.styles }/style-inline.css` )
		.pipe( autoprefixer() ) // Autoprefix CSS
		.pipe( gulp.dest( config.paths.project.dest ) )
		.pipe( browserSync.stream( { once: true } ) );

} );

/**
 * Gulp task: Build inline CSS file (for production)
 */
gulp.task( 'css:build--prod', () => {

	gutil.log( '> Building inline CSS file (PROD) ...' );

	return gulp
		.src( `${ config.paths.project.styles }/style-inline.css` )
		.pipe( autoprefixer() ) // Autoprefix CSS
		.pipe( cssmin() ) // Minify CSS
		.pipe( rename( 'style-inline.min.css' ) ) // Rename CSS file
		.pipe( gulp.dest( `${ config.paths.project.dest }/temp` ) );

} );
