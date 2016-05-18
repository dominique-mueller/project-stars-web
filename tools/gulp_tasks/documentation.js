/**
 * Import configurations
 */
import config 	from './config.json';

/**
 * Gulp imports
 */
import del 		from 'del';
import gulp 	from 'gulp';
import typedoc 	from 'gulp-typedoc';

/**
 * typedoc options
 */
const typedocOptions = {
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
};

/**
 * Gulp task: Delete all documentation
 */
export const docClean = gulp.task( 'doc:clean', () => {

	// Delete the documentation folder
	return del( `${config.paths.documentation.base}/**/*` );

} );

/**
 * Gulp task: Generate frontend documentation
 */
export const docFrontend = gulp.task( 'doc:frontend', () => {

	return gulp

		// Get all typescript files
		.src( [
			`${config.paths.app.src}/**/*.ts`,
			`${config.paths.typings.default}/browser.d.ts`
		] )

		// Generate documentation
		.pipe( typedoc( typedocOptions ) );

} );
