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
const gutil = require( 'gulp-util' );
const inlineNg2Template = require( 'gulp-inline-ng2-template' );
const tslint = require( 'gulp-tslint' );
const typescript = require( 'gulp-typescript' );

/**
 * Gulp task: Lint TypeScript
 */
gulp.task( 'typescript:lint', () => {

	// List all TypeScript source files
	return gulp
		.src( `${ config.paths.app.src }/**/*.ts` )
		.pipe( tslint() )
		.pipe( tslint.report( 'verbose' ) );

} );

/**
 * Gulp task: Build TypeScript
 */
gulp.task( 'typescript:build', () => {

	// Inline component templates and transpile TypeScript to JavaScript
	return gulp
		.src( [
			`${ config.paths.app.src }/**/*.ts`,
			`${ config.paths.typings.default }/index.d.ts`
		] )
		.pipe( inlineNg2Template( {
			base: './public/app',
			indent: 0,
			target: 'es6',
			templateExtension: '.html',
			useRelativePaths: true
		} ) )
		.pipe(
			typescript( typescript.createProject( './tsconfig.json' ) ),
			undefined,
			typescript.reporter.fullReporter()
		)
		.pipe( gulp.dest( config.paths.app.dest ) )
		.pipe( browserSync.stream( { once: true } ) );

} );
