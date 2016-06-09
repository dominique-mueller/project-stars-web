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
const sass 			= require( 'gulp-sass' );

/**
 * Gulp task: Build all SASS files into one CSS file (for development)
 */
gulp.task( 'sass:build--dev', 'Compile SASS into CSS & autoprefix CSS (for development)', () => {
	return gulp
		.src( `${ gulpConfig.paths.project.styles }/style.scss` )
		.pipe(
			sass( { // Compile SASS into CSS
				'errLogToConsole': true,
				'outputStyle': 'expanded'
			} )
			.on( 'error', sass.logError ) // Show errors
		)
		.pipe( autoprefixer( { // Autoprefix CSS
			path: './../../browserlist'
		} ) )
		.pipe( rename( 'style.css' ) ) // Rename CSS file
		.pipe( gulp.dest( gulpConfig.paths.project.dest ) )
		.pipe( browserSync.stream( { once: true } ) );
} );

/**
 * Gulp task: Build all SASS files into one CSS file (for production)
 */
gulp.task( 'sass:build--prod', 'Compile SASS into CSS & autprefix and minify CSS (for production)', () => {
	return gulp
		.src( `${ gulpConfig.paths.project.styles }/style.scss` )
		.pipe(
			sass( { // Compile SASS into CSS
				'errLogToConsole': true,
				'outputStyle': 'expanded' // CSS min is still better than just setting 'compressed' here
			} )
			.on( 'error', sass.logError ) // Show errors
		)
		.pipe( autoprefixer( { // Autoprefix CSS
			path: './../../browserlist'
		} ) )
		.pipe( cleanCSS( { // Minify CSS
			keepSpecialComments: 0 // Remove all comments
		} ) )
		// .pipe( cssmin() ) // Minify CSS
		.pipe( rename( 'style.min.css' ) ) // Rename CSS file
		.pipe( gulp.dest( gulpConfig.paths.project.dest ) );
} );
