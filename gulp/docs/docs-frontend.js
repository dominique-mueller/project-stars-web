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
			out: config.paths.docs.frontend,
			name: 'Project Stars',
			module: 'commonjs',
			target: 'es5',
			includeDeclarations: true,
			experimentalDecorators: true,
			ignoreCompilerErrors: true, // TODO: Change to false when working properly
			excludeExternals: true,
			moduleResolution: 'node',
			version: true,
			theme: 'minimal'
		} ) );

} );
