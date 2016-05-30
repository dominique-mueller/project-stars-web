'use strict';

/**
 * Import configurations
 */
const config = require( './../gulp.config.json' );
const project = require( './../../config.json' );
const htmlMinifierOptions = require( './../../.htmlminrc.json' );

/**
 * Gulp imports
 */
const browserSync = require( 'browser-sync' );
const del = require( 'del' );
const gulp = require( 'gulp-help' )( require( 'gulp' ) );
const gutil = require( 'gulp-util' );
const htmlMinifier = require( 'html-minifier' );
const inlineNg2Template = require( 'gulp-inline-ng2-template' );
const replace = require( 'gulp-replace-task' );
const stripDebug = require( 'gulp-strip-debug' );
const typescript = require( 'gulp-typescript' );
const webpack = require( 'webpack' );

/**
 * Gulp task: Build TypeScript (for development)
 */
gulp.task( 'typescript:build--dev', 'Compile TypeScript into JavaScript (for development)', () => {

	return gulp

		// We use the classic source (not the one the typescript plugin recommends) because weirdly enough performance is better
		.src( [
			`${ config.paths.project.scripts }/**/*.ts`,
			`${ config.paths.typings }/index.d.ts` // Also extended definitions
		] )

		// Set project configuration (for frontend)
		.pipe( replace( {
			patterns: [
				{
					match: 'CONFIG_ENV', // With @@ upfront
					replacement: 'dev'
				},
				{
					match: 'CONFIG_API', // With @@ upfront
					replacement: project.server.api
				},
				{
					match: 'CONFIG_NAME', // With @@ upfront
					replacement: project.name
				}
			]
		} ) )

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
			typescript( typescript.createProject( './tsconfig.json' ) ),
			undefined,
			typescript.reporter.fullReporter()
		)

		.pipe( gulp.dest( config.paths.project.dest ) )
		.pipe( browserSync.stream( { once: true } ) );

} );

/**
 * Gulp task: Build TypeScript (for production)
 */
gulp.task( 'typescript:build--prod', 'Compile TypeScript into JavaScript (for production)', () => {

	return gulp

		// We use the classic source (not the one the typescript plugin recommends) because weirdly enough performance is better
		.src( [
			`${ config.paths.project.scripts }/**/*.ts`,
			`${ config.paths.typings }/index.d.ts` // Also extended definitions
		] )

		// Set project configuration (for frontend)
		.pipe( replace( {
			patterns: [
				{
					match: 'CONFIG_ENV', // With @@ upfront
					replacement: 'prod'
				},
				{
					match: 'CONFIG_API', // With @@ upfront
					replacement: project.server.api
				},
				{
					match: 'CONFIG_NAME', // With @@ upfront
					replacement: project.name
				}
			]
		} ) )

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
			typescript( typescript.createProject( './tsconfig.json' ) ),
			undefined,
			typescript.reporter.fullReporter()
		)

		// Remove all debugging information (like console logs & alerts)
		.pipe( stripDebug() )

		.pipe( gulp.dest( `${ config.paths.project.dest }/temp` ) ); // Only temporary save ...

} );

/**
 * Gulp task: Bundle TypeScript (for production)
 */
gulp.task( 'typescript:bundle--prod', 'Bundle JavaScript into packages (for production)', [ 'typescript:build--prod' ], ( done ) => {

	webpack( {
		entry: {

			// App bundle
			app: `${ config.paths.project.dest }/temp/main`,

			// Vendor bundle (checks in the node_modules folder)
			vendor: [
				'@angular/compiler',
				'@angular/core',
				'@angular/http',
				'@angular/platform-browser',
				'@angular/platform-browser-dynamic',
				'@angular/router',
				'@ngrx/core',
				'@ngrx/store',
				'angular2-jwt',
				'immutable',
				'rxjs'
			],

			// Polyfills bundle (checks in the node_modules folder)
			polyfills: [
				'core-js/client/shim.min.js',
				'zone.js/dist/zone.min.js',
				'reflect-metadata/Reflect.js'
			]

		},
		output: {
			path: config.paths.project.dest,
			filename: '[name].bundle.min.js'
		},
		resolve: {
			extensions: [ '', '.js' ]
		},
		plugins: [

			// Minify JavaScript (Angular 2 only allows some minifaction for now ...)
			new webpack.optimize.UglifyJsPlugin( {
				mangle: false, // Else we get errors, especially zone.js seems to break
				compress: {
					screw_ie8 : true, // SCREW YOU IE ... no one likes you ...
					warnings: false // Hide optimization warnings
				},
				output: {
					comments: false
				}
			} ),

			// Create multiple bundles
			new webpack.optimize.CommonsChunkPlugin( {
				name: [ 'app', 'vendor', 'polyfills' ]
			} )

		]
	}, ( error, stats ) => {

		// Check if an error occured
		if( error ) {
			throw new gutil.PluginError( 'webpack', error );
		}

		// Log output
		gutil.log( stats.toString( {
			colors: true,
			chunks: false
		} ) );

		done();

	} );

} );
