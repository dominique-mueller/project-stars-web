/**
 * Import configurations
 */
import config 		from './config.json';

/**
 * Gulp imports
 */
import gulp 		from 'gulp';
import gutil 		from 'gulp-util';
import tslint 		from 'gulp-tslint';
import webpack 		from 'webpack';

/**
 * webpack options
 */
const webpackOptions = {
	entry: {
		app: `${ config.paths.app.src }/main`,
		vendor: [
			'angular2/core',
			'angular2/platform/browser'
		]
	},
	output: {
		path: config.paths.app.dest,
		filename: config.names.app
	},
	resolve: {
		modulesDirectories: [
			'node_modules'
		],
		extensions: [
			'.ts',
			'.js',
			''
		]
	},
	module: {
		loaders: [ {
			test: /\.ts/,
			exclude: [ 'node_modules' ],
			loader: 'ts-loader'
		} ]
	},
	plugins: [
		new webpack.optimize.CommonsChunkPlugin( {
			name: 'vendor',
			filename: config.names.vendor
		} )
	]
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
export const typescriptBuild = gulp.task( 'typescript:build', ( done ) => {

	// Run webpack
	webpack( webpackOptions, function( error, stats ) {

		// Check if an error occured
		if( error ) {
			throw new gutil.PluginError( 'webpack', error );
		}

		// Log output
		gutil.log( '[ webpack ]', stats.toString( {
			colors: true,
			chunks: false
		} ) );

		done();

	} );

} );
