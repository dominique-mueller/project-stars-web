/**
 * Import configuration
 */
import config 				from './tools/gulp_tasks/config.json';

/**
 * Gulp imports
 */
import browserSync 			from 'browser-sync';
import gulp 				from 'gulp';
import historyApiFallback 	from 'connect-history-api-fallback';
import runSequence			from 'run-sequence';

/**
 * Import our gulp tasks
 */
import * as documentation 	from './tools/gulp_tasks/documentation';
import * as env 			from './tools/gulp_tasks/env';
import * as sass 			from './tools/gulp_tasks/sass';
import * as setup 			from './tools/gulp_tasks/setup';
import * as typescript 		from './tools/gulp_tasks/typescript';

/**
 * Gulp task: Build for development
 */
gulp.task( 'build:dev', ( done ) => {
	runSequence(
		[ 'env:clean' ],
		[ 'setup:index', 'setup:systemjs', 'setup:assets', 'setup:api', 'sass:build', 'typescript:build' ],
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
		[ 'doc:clean' ],
		[ 'doc:frontend' ],
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
			middleware: [ historyApiFallback() ]
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

	// Watch SASS files
	gulp.watch( `${ config.paths.styles.src }/**/*.scss`, [ 'sass:build' ] );

	// Watch typescript files (including its templates)
	gulp.watch( `${ config.paths.app.src }/**/*`, [ 'typescript:build' ] );

} );
