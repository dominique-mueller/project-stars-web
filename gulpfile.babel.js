/**
 * Imports
 */
import gulp 		from 'gulp';
import runSequence	from 'run-sequence';

/**
 * Build development task
 * ----------------------
 * TODO: Description here
 */
gulp.task( 'build-dev', ( done ) => {

	runSequence(
		[ 'sass.lint' ],
		done
	);

} );

/**
 * Build production task
 * ---------------------
 * TODO: Description here
 */
gulp.task( 'build-prod', ( done ) => {

	runSequence(
		[ 'sass.lint' ],
		done
	);

} );
