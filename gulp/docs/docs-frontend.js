'use strict';

/**
 * Import configurations
 */
const gulpConfig 	= require( './../gulp.config.json' );
const projectConfig = require( './../../config.json' );

/**
 * Gulp imports
 */
const gulp 		= require( 'gulp-help' )( require( 'gulp' ) );
const gutil 	= require( 'gulp-util' );
const typedoc 	= require( 'gulp-typedoc' );

/**
 * Gulp task: Generate frontend documentation
 */
gulp.task( 'docs:frontend', 'Generate the frontend documentation', () => {
	gutil.log( gutil.colors.yellow( `The generated frontend documentation will be located in '${ gulpConfig.paths.docs.frontend }/index.html'` ) );
	return gulp
		.src( [
			`${ gulpConfig.paths.project.scripts }/**/*.ts`,
			`${ gulpConfig.paths.typings }/index.d.ts`
		] )
		.pipe( typedoc( {

			// Output
			out: gulpConfig.paths.docs.frontend,

			// TypeScript options
			emitDecoratorMetadata: true,
			experimentalDecorators: true,
			module: 'commonjs',
			moduleResolution: 'node',
			noImplicitAny: true,
			target: 'ES5',

			// Typedoc options
			name: projectConfig.name,
			theme: 'default', // Produces multiple pages
			version: true,
			readme: './README.md', // Show on the start page
			includeDeclarations: true,
			excludeExternals: true,
			ignoreCompilerErrors: true // Necessary due to a TypeDoc issues

		} ) );
} );
