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
const sass = require( 'gulp-sass' );

/**
 * Gulp task: Build all SASS files into one CSS file (for development)
 */
gulp.task( 'sass:build--dev', () => {

	gutil.log( '> Building SASS files (DEV) ...' );

	return gulp
		.src( `${ config.paths.project.styles }/style.scss` )
		.pipe(
			sass( { // Compile SASS into CSS
				'errLogToConsole': true,
				'outputStyle': 'expanded'
			} )
			.on( 'error', sass.logError )
		)
		.pipe( autoprefixer() ) // Autoprefix CSS
		.pipe( rename( 'style.css' ) ) // Rename CSS file
		.pipe( gulp.dest( config.paths.project.dest ) )
		.pipe( browserSync.stream( { once: true } ) );

} );

/**
 * Gulp task: Build all SASS files into one CSS file (for production)
 */
gulp.task( 'sass:build--prod', () => {

	gutil.log( '> Building SASS files (PROD) ...' );

	return gulp
		.src( `${ config.paths.project.styles }/style.scss` )
		.pipe(
			sass( { // Compile SASS into CSS
				'errLogToConsole': true,
				'outputStyle': 'expanded'
			} )
			.on( 'error', sass.logError )
		)
		.pipe( autoprefixer() ) // Autoprefix CSS
		.pipe( cssmin() ) // Minify CSS
		.pipe( rename( 'style.min.css' ) ) // Rename CSS file
		.pipe( gulp.dest( config.paths.project.dest ) );

} );
