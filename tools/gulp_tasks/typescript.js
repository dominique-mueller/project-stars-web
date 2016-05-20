/**
 * Import configurations
 */
import config 				from './config.json';

/**
 * Gulp imports
 */
import browserSync 			from 'browser-sync';
import gulp 				from 'gulp';
import gutil 				from 'gulp-util';
import inlineNg2Template 	from 'gulp-inline-ng2-template';
import tslint 				from 'gulp-tslint';
import typescript 			from 'gulp-typescript';

/**
 * typescript project
 */
const typescriptProject = typescript.createProject( './tsconfig.json' );

/**
 * inlineNg2TemplateOptions options
 */
const inlineNg2TemplateOptions = {
	base: './public/app',
	indent: 0,
	target: 'es6',
	templateExtension: '.html',
	useRelativePaths: true
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

		// Get al typescript files
		.src( [
			`${ config.paths.app.src }/**/*.ts`,
			`${ config.paths.typings.default }/index.d.ts`
		] )

		// Inline Angular 2 component templates
		.pipe( inlineNg2Template( inlineNg2TemplateOptions ) )

		// Transpile
		.pipe( typescript( typescriptProject ), undefined, typescript.reporter.fullReporter() )

		// Save
		.pipe( gulp.dest( config.paths.app.dest ) )

		// Trigger BrowserSync
		.pipe( browserSync.stream( { once: true } ) );

} );
