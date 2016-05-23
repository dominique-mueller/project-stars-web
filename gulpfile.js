'use strict';

/**
 * Import configuration
 */
const config = require( './tools/gulp_tasks/config.json' );

/**
 * Gulp imports
 */
const browserSync = require( 'browser-sync' );
const gulp = require( 'gulp' );
const historyApiFallback = require( 'connect-history-api-fallback' );
const runSequence = require( 'run-sequence' );

/**
 * Import other tasks
 */
const docs = require( './tools/gulp_tasks/docs.js' );
const env = require( './tools/gulp_tasks/env.js' );
const sass = require( './tools/gulp_tasks/sass.js' );
const typescript = require( './tools/gulp_tasks/typescript.js' );
const setup = require( './tools/gulp_tasks/setup.js' );

/**
 * Gulp task: Build for development
 */
gulp.task( 'build:dev', ( done ) => {
	runSequence(
		[ 'env:clean' ],
		[ 'setup:index', 'setup:systemjs', 'setup:assets', 'setup:apimock', 'sass:build', 'typescript:build' ],
		done
	);
} );

/**
 * Gulp task: Build for production
 */
gulp.task( 'build:prod', ( done ) => {
	runSequence(
		[ 'env:npm' ],
		[ 'sass:lint', 'typescript:lint' ],
		[ 'env:clean' ],
		[ 'setup:index', 'setup:systemjs', 'setup:assets', 'sass:build', 'typescript:build' ],
		done
	);
} );

/**
 * Gulp task: Build documentations
 */
gulp.task( 'build:docs', ( done ) => {
	runSequence(
		[ 'docs:clean' ],
		[ 'docs:frontend' ],
		done
	);
} );

/**
 * Gulp task: Watcher for development
 */
gulp.task( 'watch', [ 'build:dev' ], () => {

	// Initialize browsersync
	browserSync.init( {
		server: {
			baseDir: './',
			middleware: [ historyApiFallback() ] // To make HTML5 history possible
		},
		logPrefix: 'Browsersync',
		logConnections: true,
		notify: {
			styles: { // Custom styles for the notification in the browser
				top: 'auto',
				bottom: '0',
				right: 'auto',
				left: '50%',
				transform: 'translateX(-50%)',
				borderRadius: '0'
			}
		}
	} );

	// Watch files (SASS, TypeScript, HTML)
	gulp.watch( `${ config.paths.styles.src }/**/*.scss`, [ 'sass:build' ] );
	gulp.watch( `${ config.paths.app.src }/**/*`, [ 'typescript:build' ] );

} );
