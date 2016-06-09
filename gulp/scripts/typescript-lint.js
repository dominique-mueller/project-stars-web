'use strict';

/**
 * Import configuration
 */
const gulpConfig = require( './../gulp.config.json' );

/**
 * Gulp imports
 */
const gulp 		= require( 'gulp-help' )( require( 'gulp' ) );
const tslint 	= require( 'gulp-tslint' );

/**
 * Gulp task: Lint all TypeScript files, including the Angular 2 styleguide rules
 */
gulp.task( 'typescript:lint', 'Lint TypeScript (TSLint & Codelyzer)', () => {
	return gulp
		.src( `${ gulpConfig.paths.project.scripts }/**/*.ts` )
		.pipe( tslint() )
		.pipe( tslint.report( 'verbose' ) );
} );
