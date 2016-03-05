/**
 * Import configuration
 */
import config 			from './config.json';

/**
 * Gulp imports
 */
import autoprefixer 	from 'gulp-autoprefixer';
import browserSync 		from 'browser-sync';
import cssmin 			from 'gulp-cssmin';
import gulp 			from 'gulp';
import rename 			from 'gulp-rename';
import sass 			from 'gulp-sass';
import scsslint 		from 'gulp-scss-lint';

/**
 * sass options
 */
const sassOptions = {
	'errLogToConsole': true,
	'outputStyle': 'expanded'
};

/**
 * Gulp task: Lint SASS
 */
export const sassLint = gulp.task( 'sass:lint', () => {

	return gulp

		// Get all SASS files
		.src( `${config.paths.styles.src}/**/*.scss` )

		// Lint
		.pipe( scsslint() )

		// Report problems
		.pipe( scsslint.failReporter() );

} );

/**
 * Gulp task: Build SASS
 */
export const sassBuild = gulp.task( 'sass:build', () => {

	return gulp

		// Get main SASS files
		.src( `${config.paths.styles.src}/style.scss` )

		// Compile SASS into CSS
		.pipe( sass( sassOptions ).on( 'error', sass.logError ) )

		// Autoprefix CSS
		.pipe( autoprefixer() )

		// Minify CSS
		.pipe( cssmin() )

		// Rename CSS file name
		.pipe( rename( config.names.styles ) )

		// Save CSS file
		.pipe( gulp.dest( config.paths.styles.dest ) )

		// Trigger BrowserSync
		.pipe( browserSync.stream( { once: true } ) );

} );
