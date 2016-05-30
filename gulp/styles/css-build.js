'use strict';

/**
 * Import configuration
 */
const config = require( './../gulp.config.json' );

/**
 * Gulp imports
 */
const autoprefixer = require( 'gulp-autoprefixer' );
const browserSync = require( 'browser-sync' );
const cssmin = require( 'gulp-cssmin' );
const gulp = require( 'gulp-help' )( require( 'gulp' ) );
const rename = require( 'gulp-rename' );

/**
 * Gulp task: Build inline CSS file (for development)
 */
gulp.task( 'css:build--dev', 'Optimize inline CSS (for development)', () => {
	return gulp
		.src( `${ config.paths.project.styles }/style-inline.css` )
		.pipe( autoprefixer() ) // Autoprefix CSS
		.pipe( gulp.dest( config.paths.project.dest ) )
		.pipe( browserSync.stream( { once: true } ) );
} );

/**
 * Gulp task: Build inline CSS file (for production)
 */
gulp.task( 'css:build--prod', 'Optimize inline CSS (for production)', () => {
	return gulp
		.src( `${ config.paths.project.styles }/style-inline.css` )
		.pipe( autoprefixer() ) // Autoprefix CSS
		.pipe( cssmin() ) // Minify CSS
		.pipe( rename( 'style-inline.min.css' ) ) // Rename CSS file
		.pipe( gulp.dest( `${ config.paths.project.dest }/temp` ) );
} );
