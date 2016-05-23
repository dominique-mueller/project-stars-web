'use strict';

/**
 * Imports configuration
 */
const config = require( './config.json' );

/**
 * Gulp imports
 */
const autoprefixer = require( 'gulp-autoprefixer' );
const browserSync = require( 'browser-sync' );
const cssmin = require( 'gulp-cssmin' );
const gulp = require( 'gulp' );
const rename = require( 'gulp-rename' );
const sass = require( 'gulp-sass' );
const scsslint = require( 'gulp-scss-lint' );

/**
 * Gulp task: Lint SASS
 */
gulp.task( 'sass:lint', () => {

	return gulp

		// Get all SASS files
		.src( `${ config.paths.styles.src }/**/*.scss` )

		// Lint
		.pipe( scsslint() )

		// Report problems
		.pipe( scsslint.failReporter() );

} );

/**
 * Gulp task: Build SASS
 */
gulp.task( 'sass:build', () => {

	return gulp

		// Get main SASS files
		.src( `${ config.paths.styles.src }/style.scss` )

		// Compile SASS into CSS
		.pipe( sass( {
			'errLogToConsole': true,
			'outputStyle': 'expanded'
		} )
		.on( 'error', sass.logError ) )

		// Autoprefix CSS
		.pipe( autoprefixer() )

		// Minify CSS
		// .pipe( cssmin() )

		// Rename CSS file name
		.pipe( rename( config.names.styles ) )

		// Save CSS file
		.pipe( gulp.dest( config.paths.styles.dest ) )

		// Trigger BrowserSync
		.pipe( browserSync.stream( { once: true } ) );

} );
