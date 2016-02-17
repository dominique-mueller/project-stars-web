/**
 * Imports
 */
import config 	from './config.json';
import gulp 	from 'gulp';
import tslint 	from 'gulp-tslint';

/**
 * Typescript lint gulp task
 */
export default gulp.task( 'typescript.lint', () => {

	return gulp

		// Get all typescript files
		.src( `${config.paths.app.src}/**/*.ts` )

		// Lint
		.pipe( tslint() )

		// Report problems
		.pipe( tslint.report( 'verbose' ) );

} );
