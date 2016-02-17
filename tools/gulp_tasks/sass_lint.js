/**
 * Imports
 */
import config 	from './config.json';
import gulp 	from 'gulp';
import scsslint from 'gulp-scss-lint';

/**
 * scsslint options
 */
const scsslintOptions = {
	'config': '.scss-lint.yml'
};

/**
 * SASS linter gulp task
 */
export default gulp.task( 'sass.lint', () => {

	return gulp

		// Get all SASS files
		.src( `${config.paths.styles.src}**/*.scss` )

		// Lint
		.pipe( scsslint( scsslintOptions ) )

		// Report problems
		.pipe( scsslint.failReporter() );

} );
