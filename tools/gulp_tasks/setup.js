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
		.pipe( gulp.dest( config.paths.project.dest ) )

		.pipe( browserSync.stream( { once: true } ) );

} );

/**
 * Gulp task: Setup vendor files
 */
export const vendor = gulp.task( 'setup:vendor', () => {

	// Copy vendor files
	return gulp

		.src( [
			'node_modules/angular2/bundles/angular2-polyfills.js',
			'node_modules/systemjs/dist/system.src.js',
			'node_modules/rxjs/bundles/Rx.js',
			'node_modules/angular2/bundles/angular2.dev.js',
			'node_modules/angular2/bundles/http.dev.js',
			'node_modules/angular2/bundles/router.dev.js',
			'node_modules/@ngrx/store/dist/*.js',
			'node_modules/immutable/dist/immutable.js'
		] )
		.pipe( gulp.dest( config.paths.app.vendor ) );

} );

/**
 * Gulp task: Setup temp api data
 */
export const api = gulp.task( 'setup:api', () => {

	// Copy data files
	return gulp

		.src( [
			'public/app/services/bookmark/bookmarks.mock.json',
			'public/app/services/folder/folders.mock.json',
			'public/app/services/label/labels.mock.json'
		] )
		.pipe( gulp.dest( config.paths.project.dest ) );

} );
