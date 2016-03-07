/**
 * Import configuration
 */
import config 			from './tools/gulp_tasks/config.json';

/**
 * Gulp imports
 */
import browserSync 		from 'browser-sync';
import gulp 			from 'gulp';
import runSequence		from 'run-sequence';

/**
 * Import our gulp tasks
 */
import * as env 		from './tools/gulp_tasks/env';
import * as sass 		from './tools/gulp_tasks/sass';
import * as setup 		from './tools/gulp_tasks/setup';
import * as typescript 	from './tools/gulp_tasks/typescript';

/**
 * Build development task
 * ----------------------
 * - First we are linting our SASS and Typescript files
 * - If linting was successful, we then clean the build directory
 * - After that we build the CSS and JavaScript files
 */
gulp.task( 'build:dev', ( done ) => {

	runSequence(
		[ 'env:clean' ],
		[ 'setup:index', 'setup:vendor', 'sass:build', 'typescript:build' ],
		done
	);

} );

/**
 * Build production task
 * ---------------------
 * - Before we start, let's first check whether the npm dependencies are up-to-date
 * - First we are linting our SASS and Typescript files
 * - If linting was successful, we then clean the build directory
 * - After that we build the CSS and JavaScript files
 */
gulp.task( 'build:prod', ( done ) => {

	runSequence(
		[ 'env:npm' ],
		[ 'sass:lint', 'typescript:lint' ],
		[ 'env:clean' ],
		[ 'setup:index', 'setup:vendor', 'sass:build', 'typescript:build' ],
		done
	);

} );

/**
 * Watcher task
 * ------------
 * We are watching our typescript, html and sass files. When a file changes, we run the
 * correct gulp task to update the build and reload the app in the browser.
 */
gulp.task( 'watch', [ 'build:dev' ], () => {

	// Initialize browsersync
	browserSync.init( {
		server: {
			baseDir: config.paths.project.dest,
			index: 'index.html'
		},
		logPrefix: 'Browsersync',
		logConnections: true
	} );

	// Watch SASS files
	gulp.watch( `${config.paths.styles.src}/**/*.scss`, [ 'sass:build' ] );

	// Watch typescript files (including its templates)
	gulp.watch( `${config.paths.app.src}/**/*`, [ 'typescript:build' ] );

	// Watch index file and svg icon files
	gulp.watch( [
		`${config.paths.project.src}/index.html`,
		`${config.paths.icons.src}>/*.svg`
	], [ 'setup:index' ] );

} );
