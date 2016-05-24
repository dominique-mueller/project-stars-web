'use strict';

/**
 * Import configuration
 */
const config = require( './../config.json' );

/**
 * Gulp imports
 */
const browserSync = require( 'browser-sync' );
const del = require( 'del' );
const gulp = require( 'gulp' );
const gutil = require( 'gulp-util' );
const htmlMinifier = require( 'html-minifier' );
const htmlMinifierOptions = require( './../.htmlminrc.json' );
const inlineNg2Template = require( 'gulp-inline-ng2-template' );
const stripDebug = require( 'gulp-strip-debug' );
const typescript = require( 'gulp-typescript' );
const webpack = require( 'webpack' );
const webpackStream = require( 'webpack-stream' );

/**
 * Gulp task: Build TypeScript (for development)
 */
gulp.task( 'typescript:build--dev', () => {

	gutil.log( '> Building TypeScript files (DEV) ...' );

	return gulp

		// We use the classic source (not the one the typescript plugin recommends) because weirdly enough performance is better
		.src( [
			`${ config.paths.project.scripts }/**/*.ts`,
			`${ config.paths.typings }/index.d.ts` // Also extended definitions
		] )

		// Inline Angular 2 component templates first (formatting is better this way)
		.pipe( inlineNg2Template( {
			base: config.paths.project.scripts, // Angular 2 app folder
			indent: 0,
			target: 'es6', // Compiled later on to ES5 anyway
			templateExtension: '.html',
			useRelativePaths: true
		} ) )

		// Transpile TypeScript to JavaScript, depending on TS config
		.pipe(
			typescript( typescript.createProject( `${ config.paths.root }/tsconfig.json` ) ),
			undefined,
			typescript.reporter.fullReporter()
		)

		.pipe( gulp.dest( config.paths.project.dest ) )
		.pipe( browserSync.stream( { once: true } ) );
} );

/**
 * Gulp task: Build TypeScript (for production)
 */
gulp.task( 'typescript:build--prod', () => {

	gutil.log( '> Building TypeScript files (PROD) ...' );

	return gulp

		// We use the classic source (not the one the typescript plugin recommends) because weirdly enough performance is better
		.src( [
			`${ config.paths.project.scripts }/**/*.ts`,
			`${ config.paths.typings }/index.d.ts` // Also extended definitions
		] )

		// Inline Angular 2 component templates first (formatting is better this way)
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
			typescript( typescript.createProject( `${ config.paths.root }/tsconfig.json` ) ),
			undefined,
			typescript.reporter.fullReporter()
		)

		// Remove all debugging information (like console logs & alerts)
		.pipe( stripDebug() )

		.pipe( gulp.dest( config.paths.project.dest ) ); // Only temporary save ...

} );

/**
 * Gulp task: Bundle TypeScript (for production)
 */
gulp.task( 'typescript:bundle--prod', [ 'typescript:build--prod' ], () => {

	gutil.log( '> Bundling JavaScript files (PROD) ...' );

	return gulp

		// We use the entry point for the application
		.src( [
			`${ config.paths.project.dest }/**/*.js`
		] )

		// Create bundles via Webpack
		.pipe( webpackStream( {
			entry: {

				// App bundle
				app: `${ config.paths.project.dest }/main`,

				// Vendor bundle (checks in the node_modules folder)
				ventor: [
					'@angular/compiler',
					'@angular/core',
					'@angular/http',
					'@angular/platform-browser',
					'@angular/platform-browser-dynamic',
					'@angular/router',
					'angular2-jwt',
					'immutable',
					'rxjs'
				],

				// Polyfills bundle (checks in the node_modules folder)
				polyfills: [
					'es6-shim/es6-shim.min.js',
					'zone.js/dist/zone.min.js',
					'reflect-metadata/Reflect.js'
				]

			},
			output: {
				filename: '[name].bundle.min.js'
			},
			resolve: {
				extensions: [ '', '.js' ]
			},
			plugins: [

				// Stop the build process if errors are thrown
				new webpack.NoErrorsPlugin(),

				// Detect (and skip / remove) identical files
				new webpack.optimize.DedupePlugin(),

				// Minify JavaScript
				new webpack.optimize.UglifyJsPlugin(),

				// Create multiple bundles
				new webpack.optimize.CommonsChunkPlugin( {
					name: [ 'app', 'vendor', 'polyfills' ]
				} )

			]
		} ) )

		// Remove the old JS files, they were just temporary - because WebPack only seems to work with entry files
		.pipe( gulp.dest( config.paths.project.dest ) );

} );
