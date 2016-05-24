'use strict';

/**
 * Import configuration
 */
const config = require( './gulp/config.json' );

/**
 * Gulp imports
 */
const browserSync = require( 'browser-sync' );
const gulp = require( 'gulp' );
const gutil = require( 'gulp-util' );
const historyApiFallback = require( 'connect-history-api-fallback' );
const runSequence = require( 'run-sequence' );

/**
 * Import all single Gulp tasks
 */
const docsFrontend = require( './gulp/docs/docs-frontend.js' );
const envCleanBuild = require( './gulp/env/env-clean-build.js' );
const envCleanDocs = require( './gulp/env/env-clean-docs.js' );
const envNcu = require( './gulp/env/env-ncu.js' );
const typescriptBuild = require( './gulp/scripts/typescript-build.js' );
const typescriptLint = require( './gulp/scripts/typescript-lint.js' );
const setupApimock = require( './gulp/setup/setup-apimock.js' );
const setupAssets = require( './gulp/setup/setup-assets.js' );
const setupConfig = require( './gulp/setup/setup-config.js' );
const setupIndex = require( './gulp/setup/setup-index.js' );
const sassBuild = require( './gulp/styles/sass-build.js' );
const sassLint = require( './gulp/styles/sass-lint.js' );

/**
 * Gulp task: Build application - for development
 * TODO: Remove apimock
 */
gulp.task( 'build:dev', ( done ) => {

	gutil.log( gutil.colors.blue( '>>> Starting BUILD for DEVELOPMENT ...' ) );

	runSequence(
		[ 'env:clean:build' ],
		[ 'setup:assets', 'setup:config', 'setup:apimock', 'sass:build--dev', 'typescript:build--dev' ],
		[ 'setup:index--dev' ],
		done
	);

} );

/**
 * Gulp task: Build application - for production
 * TODO: Remove apimock
 */
gulp.task( 'build:prod', ( done ) => {

	gutil.log( gutil.colors.blue( '>>> Starting BUILD for PRODUCTION ...' ) );

	runSequence(
		[ 'sass:lint', 'typescript:lint', 'env:clean:build' ],
		[ 'setup:assets', 'sass:build--prod', 'typescript:bundle--prod' ],
		[ 'setup:index--prod' ],
		[ 'env:clean:tempbuild' ],
		done
	);

} );

/**
 * Gulp task: Build documentations
 */
gulp.task( 'build:docs', ( done ) => {

	gutil.log( gutil.colors.blue( '>>> Starting BUILD for DOCUMENTATION ...' ) );

	runSequence(
		[ 'env:clean:docs' ],
		[ 'docs:frontend' ],
		done
	);

} );

/**
 * Gulp task: Browser sync watcher - for development
 */
gulp.task( 'watch', [ 'build:dev' ], () => {

	gutil.log( gutil.colors.blue( '>>> Starting DEV ENVIRONMENT watcher ...' ) );

	// Initialize browsersync
	browserSync.init( {
		server: {
			baseDir: './', // To also get access to the node modules folder
			middleware: [
				historyApiFallback() // To allow usage of the HTML5 history
			]
		},
		logPrefix: 'Browsersync',
		logConnections: true,
		notify: {
			styles: { // Custom styles for the notification in the browser, bottom center
				top: 'auto',
				bottom: '0',
				right: 'auto',
				left: '50%',
				transform: 'translateX(-50%)',
				borderRadius: '0'
			}
		}
	} );

	// Watch files
	gulp.watch( `${ config.paths.project.styles }/**/*.scss`, [ 'sass:build--dev' ] ); // SASS files
	gulp.watch( `${ config.paths.project.scripts }/**/*`, [ 'typescript:build--dev' ] ); // TypeScript files including HTML templates

} );
