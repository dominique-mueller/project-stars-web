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
const gutil = require( 'gulp-util' );
const htmlMinifier = require( 'html-minifier' );
const htmlMinifierOptions = require( './../.htmlminrc.json' );
const inlineNg2Template = require( 'gulp-inline-ng2-template' );
const typescript = require( 'gulp-typescript' );

/**
 * Gulp task: Build TypeScript
 */
gulp.task( 'typescript:build', () => {
	return gulp

		// We use the classic source (not the one the typescript plugin recommends) because performance is better
		.src( [
			`${ config.paths.project.scripts }/**/*.ts`,
			`${ config.paths.typings }/${ config.names.typings }` // Also extended definitions
		] )

		// Minify and inline Angular 2 component templates first (formatting better)
		.pipe( inlineNg2Template( {
			base: config.paths.project.scripts, // Angular 2 app folder
			indent: 0,
			target: 'es6', // Compiled later on to ES5 anyway
			templateExtension: '.html',
			templateProcessor: ( ext, file ) => { // Minify HTML
				return htmlMinifier.minify( file, htmlMinifierOptions );
			},
			useRelativePaths: true
		} ) )

		// Transpile TypeScript to JavaScript, depending on TS config
		.pipe(
			typescript( typescript.createProject( `${ config.paths.root }/${ config.names.tsconfig }` ) ),
			undefined,
			typescript.reporter.fullReporter()
		)

		.pipe( gulp.dest( config.paths.project.dest ) )
		.pipe( browserSync.stream( { once: true } ) );

} );
