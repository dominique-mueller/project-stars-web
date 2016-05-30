'use strict';

/**
 * Import configurations
 */
const config = require( './../gulp.config.json' );

/**
 * Gulp imports
 */
const gulp = require( 'gulp-help' )( require( 'gulp' ) );
const gutil = require( 'gulp-util' );
const typedoc = require( 'gulp-typedoc' );

/**
 * Gulp task: Generate frontend documentation
 */
gulp.task( 'docs:frontend', 'Generate frontend documentation', () => {
	gutil.log( gutil.colors.yellow( `The generated frontend documentation will be found in '${ config.paths.docs.frontend }/index.html'` ) );
	return gulp
		.src( [
			`${ config.paths.project.scripts }/**/*.ts`,
			`${ config.paths.typings }/index.d.ts`
		] )
		.pipe( typedoc( {

			// Output
			out: config.paths.docs.frontend,

			// TypeScript options
			emitDecoratorMetadata: true,
			experimentalDecorators: true,
			module: 'commonjs',
			moduleResolution: 'node',
			noImplicitAny: true,
			target: 'ES5',

			// Typedoc options
			name: 'Project Stars',
			theme: 'default', // Produces multiple pages
			version: true,
			readme: './README.md',
			includeDeclarations: true,
			excludeExternals: true,
			ignoreCompilerErrors: true // TODO: Necessary due to TypeDoc issues

		} ) );
} );
