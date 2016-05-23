'use strict';

/**
 * Import configurations
 */
const config = require( './config.json' );

/**
 * Gulp imports
 */
const del = require( 'del' );
const gulp = require( 'gulp' );
const typedoc = require( 'gulp-typedoc' );

/**
 * Gulp task: Delete all documentation
 */
gulp.task( 'docs:clean', () => {
	return del( `${ config.paths.documentation.base }/**/*` );
} );

/**
 * Gulp task: Generate frontend documentation
 */
gulp.task( 'docs:frontend', () => {

	// Generate documentation out of TypeScript files
	return gulp
		.src( [
			`${ config.paths.app.src }/**/*.ts`,
			`${ config.paths.typings.default }/index.d.ts`
			// TODO: RxJS typings not found?
		] )
		.pipe( typedoc( {
			out: config.paths.documentation.frontend,
			name: 'Project Stars',
			module: 'system',
			target: 'es5',
			includeDeclarations: false,
			experimentalDecorators: true,
			ignoreCompilerErrors: false,
			excludeExternals: true,
			moduleResolution: 'node',
			version: true,
			theme: 'minimal'
		} ) );

} );
