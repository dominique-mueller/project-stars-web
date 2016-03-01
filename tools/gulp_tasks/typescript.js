/**
 * Import configurations
 */
import config 		from './config.json';

/**
 * Gulp imports
 */
import browserSync 	from 'browser-sync';
import gulp 		from 'gulp';
import tslint 		from 'gulp-tslint';
import webpack 		from 'webpack-stream';

/**
 * webpack options
 */
const webpackOptions = {
	output: {
		filename: config.names.app
	},
	resolve: {
		extensions: [ '', '.ts', '.js' ]
	},
	module: {
		loaders: [
			{ test: /\.ts$/, loader: 'ts-loader', exclude: /node_modules/ }
		]
	}
};

/**
 * Gulp task: Lint TypeScript
 */
export const typescriptLint = gulp.task( 'typescript:lint', () => {

	return gulp

		// Get all typescript files
		.src( `${config.paths.app.src}/**/*.ts` )

		// Lint
		.pipe( tslint() )

		// Report problems
		.pipe( tslint.report( 'verbose' ) );

} );

/**
 * Gulp task: Build TypeScript
 */
export const typescriptBuild = gulp.task( 'typescript:build', () => {

	return gulp

		// Get the typescript entry file
		.src( `${ config.paths.app.src }/main.ts` )

		// Compile and bundle
		.pipe( webpack( webpackOptions ) )

		// Save JavaScript file
		.pipe( gulp.dest( config.paths.app.dest ) );

} );
