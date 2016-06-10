'use strict';

/**
 * Import configuration
 */
const gulpConfig = require( './gulp/gulp.config.json' );

/**
 * Gulp imports
 */
const browserSync 			= require( 'browser-sync' );
const gulp 					= require( 'gulp-help' )( require( 'gulp' ) );
const gutil 				= require( 'gulp-util' );
const historyApiFallback 	= require( 'connect-history-api-fallback' );
const runSequence 			= require( 'run-sequence' );

/**
 * Import all single Gulp tasks
 */
const docsFrontend 		= require( './gulp/docs/docs-frontend.js' );
const envCleanBuild 	= require( './gulp/env/env-clean-build.js' );
const envCleanDocs 		= require( './gulp/env/env-clean-docs.js' );
const typescriptBuild 	= require( './gulp/scripts/typescript-build.js' );
const typescriptLint 	= require( './gulp/scripts/typescript-lint.js' );
const setupAssets 		= require( './gulp/setup/setup-assets.js' );
const setupConfig 		= require( './gulp/setup/setup-config.js' );
const setupIndex 		= require( './gulp/setup/setup-index.js' );
const sassBuild 		= require( './gulp/styles/sass-build.js' );
const sassLint 			= require( './gulp/styles/sass-lint.js' );
const cssBuild 			= require( './gulp/styles/css-build.js' );

/**
 * Gulp task: Build application - for development
 */
gulp.task( 'build:dev', '### BUILD FOR DEVELOPMENT', ( done ) => {
	gutil.log( gutil.colors.green( 'Running build process for development environment ...' ) );
	runSequence(
		[ 'env:clean:build' ],
		[ 'setup:assets', 'setup:config', 'css:build--dev', 'sass:build--dev', 'typescript:build--dev' ],
		[ 'setup:index--dev' ],
		done
	);
} );

/**
 * Gulp task: Build application - for production
 */
gulp.task( 'build:prod', '### BUILD FOR PRODUCTION', ( done ) => {
	gutil.log( gutil.colors.green( 'Running build process for production environment ...' ) );
	runSequence(
		[ 'env:clean:build' ],
		[ 'setup:assets', 'sass:lint', 'typescript:lint', 'css:build--prod', 'sass:build--prod', 'typescript:bundle--prod' ],
		[ 'setup:index--prod' ],
		[ 'env:clean:tempbuild' ],
		done
	);
} );

/**
 * Gulp task: Build documentations
 */
gulp.task( 'build:docs', '### GENERATE DOCUMENTATION', ( done ) => {
	gutil.log( gutil.colors.green( 'Generating documentation ...' ) );
	runSequence(
		[ 'env:clean:docs' ],
		[ 'docs:frontend' ],
		done
	);
} );

/**
 * Gulp task: BrowserSync watcher - FOR DEVELOPMENT ONLY
 */
gulp.task( 'watch', '### START BROWSERSYNC WATCHER', [ 'build:dev' ], () => {
	gutil.log( gutil.colors.green( 'Setting up BrowserSync watcher ...' ) );

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
	gulp.watch( `${ gulpConfig.paths.project.styles }/**/*.scss`, [ 'sass:build--dev' ] ); // SASS files
	gulp.watch( `${ gulpConfig.paths.project.scripts }/**/*`, [ 'typescript:build--dev' ] ); // TypeScript files including HTML templates
	gulp.watch( `${ gulpConfig.paths.project.base }/index.html`, [ 'setup:index--dev' ] ); // Index file
	gulp.watch( `${ gulpConfig.paths.project.base }/*.js`, [ 'setup:config' ] ); // Configuration files

} );
