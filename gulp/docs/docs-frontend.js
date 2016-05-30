'use strict';

/**
 * Import configurations
 */
const config = require( './../config.json' );

/**
 * Gulp imports
 */
const gulp = require( 'gulp' );
const gutil = require( 'gulp-util' );
const typedoc = require( 'gulp-typedoc' );

/**
 * Gulp task: Generate frontend documentation
 */
gulp.task( 'docs:frontend', () => {

	gutil.log( '> Generating frontend docs ...' );

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
			theme: 'default',
			version: true,
			readme: './README.md',
			includeDeclarations: true,
			excludeExternals: true,
			ignoreCompilerErrors: true // TODO: Change to false when working properly

		} ) );

} );
