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
const inlineNg2Template = require( 'gulp-inline-ng2-template' );
const typescript = require( 'gulp-typescript' );

/**
 * Gulp task: Build TypeScript
 */
gulp.task( 'typescript:build', () => {
	return gulp
		.src( [
			`${ config.paths.project.scripts }/**/*.ts`,
			`${ config.paths.typings }/${ config.names.typings }` // Also extended definitions
		] )
		.pipe( inlineNg2Template( { // Inline Angular 2 component templates
			base: config.paths.project.scripts,
			indent: 0,
			target: 'es6',
			templateExtension: '.html',
			useRelativePaths: true
		} ) )
		.pipe( // Transpile TypeScript to JavaScript, depending on TS config
			typescript( typescript.createProject( `${ config.paths.root }/${ config.names.tsconfig }` ) ),
			undefined,
			typescript.reporter.fullReporter()
		)
		.pipe( gulp.dest( config.paths.project.dest ) )
		.pipe( browserSync.stream( { once: true } ) );
} );
