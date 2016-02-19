/**
 * Imports
 */
import autoprefixer 	from 'gulp-autoprefixer';
import config 			from './config.json';
import cssmin 			from 'gulp-cssmin';
import gulp 			from 'gulp';
import rename 			from 'gulp-rename';
import sass 			from 'gulp-sass';

/**
 * sass options
 */
const sassOptions = {
	'errLogToConsole': true,
	'outputStyle': 'expanded'
};

/**
 * autoprefixer options
 */
const autoprefixerOptions = {
	'path': 'browserlist'
};

/**
 * Gulp task
 * ---------
 * Compile all SASS files into one autoprefixed and minified CSS file
 */
export default gulp.task( 'sass:build', () => {

	return gulp

		// Get main SASS files
		.src( `${config.paths.styles.src}/style.scss` )

		// Compile SASS into CSS
		.pipe( sass( sassOptions ).on( 'error', sass.logError ) )

		// Autoprefix CSS
		.pipe( autoprefixer( autoprefixerOptions ) )

		// Minify CSS
		.pipe( cssmin() )

		// Rename CSS file name
		.pipe( rename( config.names.styles ) )

		// Save CSS file
		.pipe( gulp.dest( config.paths.styles.dest ) );

} );
