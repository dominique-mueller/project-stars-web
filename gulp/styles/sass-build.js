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
// const cssmin = require( 'gulp-cssmin' );
const gulp = require( 'gulp' );
const rename = require( 'gulp-rename' );
const sass = require( 'gulp-sass' );

/**
 * Gulp task: Build all SASS files into one CSS file
 */
gulp.task( 'sass:build', () => {
	return gulp
		.src( `${ config.paths.project.styles }/style.scss` )
		.pipe( sass( { // Compile SASS into CSS
			'errLogToConsole': true,
			'outputStyle': 'expanded'
		} )
		.on( 'error', sass.logError ) )
		.pipe( autoprefixer() ) // Autoprefix CSS
		// .pipe( cssmin() ) // Minify CSS
		.pipe( rename( config.names.styles ) ) // Rename CSS file name
		.pipe( gulp.dest( config.paths.project.dest ) )
		.pipe( browserSync.stream( { once: true } ) );
} );
