/**
 * Imports
 */
import config 				from './config.json'
import gulp 				from 'gulp';
import typescript 			from 'gulp-typescript';
import typescriptOptions 	from '../../tsconfig.json';

/**
 * Gulp task
 * ---------
 * Transpile all Typescript files into ES5 JavaScript files
 */
export default gulp.task( 'typescript.build', () => {

	return gulp

		// Get all typescript files
		.src( `${config.paths.app.src}/**/*.ts` )

		// Compile TS into JS (and report problems)
		.pipe( typescript( typescriptOptions.compilerOptions, undefined, typescript.reporter.fullReporter() ) )

		// Save JavaScript file
		.pipe( gulp.dest( config.paths.app.dest ) );

} );
