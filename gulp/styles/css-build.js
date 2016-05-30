'use strict';

/**
 * Import configuration
 */
const gulpConfig = require( './../gulp.config.json' );

/**
 * Gulp imports
 */
const autoprefixer 	= require( 'gulp-autoprefixer' );
const browserSync 	= require( 'browser-sync' );
const cleanCSS 		= require( 'gulp-clean-css' );
const gulp 			= require( 'gulp-help' )( require( 'gulp' ) );
const rename 		= require( 'gulp-rename' );

/**
 * Gulp task: Build inline CSS file (for development)
 */
gulp.task( 'css:build--dev', 'Setup and optimize inline CSS (for development)', () => {
	return gulp
		.src( `${ gulpConfig.paths.project.styles }/style-inline.css` )
		.pipe( autoprefixer( { // Autoprefix CSS
			path: './../../browserlist'
		} ) )
		.pipe( gulp.dest( gulpConfig.paths.project.dest ) )
		.pipe( browserSync.stream( { once: true } ) );
} );

/**
 * Gulp task: Build inline CSS file (for production)
 */
gulp.task( 'css:build--prod', 'Setup and optimize inline CSS (for production)', () => {
	return gulp
		.src( `${ gulpConfig.paths.project.styles }/style-inline.css` )
		.pipe( autoprefixer( { // Autoprefix CSS
			path: './../../browserlist'
		} ) )
		.pipe( cleanCSS( { // Minify CSS
			keepSpecialComments: 0 // Remove all comments
		} ) )
		.pipe( rename( 'style-inline.min.css' ) ) // Rename CSS file
		.pipe( gulp.dest( `${ gulpConfig.paths.project.dest }/temp` ) );
} );
