/**
 * Import configurations
 */
import config 		from './config.json';

/**
 * Gulp imports
 */
import browserSync 	from 'browser-sync';
import gulp 		from 'gulp';
import inject 		from 'gulp-inject';
import rename 		from 'gulp-rename';
import svgstore 	from 'gulp-svgstore';

/**
 * svgstore options
 */
const svgstoreOptions = {
	inlineSvg: true
};

/**
 * Gulp task: Setup index file
 */
export const icons = gulp.task( 'setup:index', () => {

	// First up generate the svg
	const svgString = gulp

		// Get all SVG icons
		.src( `${config.paths.icons.src}/*.svg` )

		// Prefix file name
		.pipe( rename( { prefix: 'icon-' } ) )

		// Combine SVG icons
		.pipe( svgstore( svgstoreOptions ) );

	// Then inject the svg
	return gulp

		// Get the index file
		.src( `${config.paths.project.src}/index.html` )

		// Inject svg String into index
		.pipe( inject( svgString, { transform: ( path, file ) => {
			return file.contents.toString();
		} } ) )

		// Save the new index
		.pipe( gulp.dest( config.paths.root ) )

		.pipe( browserSync.stream( { once: true } ) );

} );

/**
 * Gulp task: Copy systemjs module configuration file
 */
export const systemjs = gulp.task( 'setup:systemjs', () => {

	return gulp
		.src( `${ config.paths.project.src }/systemjs.config.js` )
		.pipe( gulp.dest( config.paths.app.dest ) );

} );

/**
 * Gulp task: Setup temp api data
 * TODO: Remove me
 */
export const api = gulp.task( 'setup:api', () => {

	// Copy data files
	return gulp

		.src( [
			`${ config.paths.app.src }/services/bookmark/bookmarks.mock.json`,
			`${ config.paths.app.src }/services/folder/folders.mock.json`,
			`${ config.paths.app.src }/services/label/labels.mock.json`,
			`${ config.paths.app.src }/services/user/user.mock.json`
		] )
		.pipe( gulp.dest( config.paths.app.apimock ) );

} );
