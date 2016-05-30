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
const htmlMinifierOptions = require( './../../.htmlminrc.json' );
const inlineNg2Template = require( 'gulp-inline-ng2-template' );
const stripDebug = require( 'gulp-strip-debug' );
const typescript = require( 'gulp-typescript' );
const webpack = require( 'webpack' );

/**
 * Gulp task: Build TypeScript (for development)
 */
gulp.task( 'typescript:build--dev', () => {

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
gulp.task( 'typescript:build--prod', () => {

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
gulp.task( 'typescript:bundle--prod', [ 'typescript:build--prod' ], ( done ) => {

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

			// Minify JavaScript
			new webpack.optimize.UglifyJsPlugin( {
				mangle: false, // Necessary for Angular 2 for now
				compress: {
					warnings: false // Just hide them ... please ...
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
