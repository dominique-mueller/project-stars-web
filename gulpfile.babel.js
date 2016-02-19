/**
 * Imports
 */
import envClean 		from './tools/gulp_tasks/env_clean';
import envNpm 			from './tools/gulp_tasks/env_npm';
import gulp 			from 'gulp';
import runSequence		from 'run-sequence';
import sassBuild 		from './tools/gulp_tasks/sass_build';
import sassLint 		from './tools/gulp_tasks/sass_lint';
import typescriptBuild 	from './tools/gulp_tasks/typescript_build';
import typescriptLint 	from './tools/gulp_tasks/typescript_lint';

/**
 * Build development task
 * ----------------------
 * - First we are linting our SASS and Typescript files
 * - If linting was successful, we then clean the build directory
 * - After that we build the CSS and JavaScript files
 */
gulp.task( 'build:dev', ( done ) => {

	runSequence(
		[ 'sass:lint', 'typescript:lint' ],
		[ 'env:clean' ],
		[ 'sass:build', 'typescript:build' ],
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
		[ 'sass:build', 'typescript:build' ],
		done
	);

} );
