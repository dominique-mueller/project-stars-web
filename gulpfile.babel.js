/**
 * Imports
 */
import envNpm 			from './tools/gulp_tasks/env_npm';
import gulp 			from 'gulp';
import runSequence		from 'run-sequence';
import sassLint 		from './tools/gulp_tasks/sass_lint';
import sassBuild 		from './tools/gulp_tasks/sass_build';
import typescriptBuild 	from './tools/gulp_tasks/typescript_build';

/**
 * Build development task
 * ----------------------
 * TODO: Description here
 */
gulp.task( 'build-dev', ( done ) => {

	runSequence(
		[ 'sass.lint' ],
		[ 'sass.build', 'typescript.build' ],
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
		[ 'env.npm' ],
		[ 'sass.lint' ],
		[ 'sass.build', 'typescript.build' ],
		done
	);

} );
