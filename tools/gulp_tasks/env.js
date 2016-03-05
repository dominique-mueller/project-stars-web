/**
 * Import configuration
 */
import config 	from './config.json';

/**
 * Gulp imports
 */
import del 		from 'del';
import gulp 	from 'gulp';
import gutil 	from 'gulp-util';
import ncu 		from 'npm-check-updates';

/**
 * Gulp task: Clean build folder
 */
export const envClean = gulp.task( 'env:clean', () => {

	// Delete folder and files
	return del( `${config.paths.project.dest}/**/*` );

} );

/**
 * Gulp task: Check for NPM dependency upgrades
 */
export const envNpm = gulp.task( 'env:npm', () => {

	// Check for npm dependency updates
	ncu.run().then( ( results ) => {

		// Print (pretty) results
		if ( Object.keys( results ).length === 0 ) {
			gutil.log( 'All npm dependencies match the latest package version :)' );
		} else {
			gutil.log( 'The following npm dependencies should be upgraded:' );
			for ( const key in results ) {
				gutil.log( '-', gutil.colors.blue( key ), '\t->',
					gutil.colors.yellow( results[ key ] ), 'is available' );
			}
		}

	} );

} );

/**
 * Gulp task: Seup env
 */
export const html = gulp.task( 'env:setup', () => {

	// Copy index.html file
	gulp.src( `${config.paths.project.src}/index.html` )
		.pipe( gulp.dest( config.paths.project.dest ) );

	// Copy vendor files
	gulp.src( [
			'node_modules/angular2/bundles/angular2-polyfills.js',
			'node_modules/systemjs/dist/system.src.js',
			'node_modules/rxjs/bundles/Rx.js',
			'node_modules/angular2/bundles/angular2.dev.js'
		] )
		.pipe( gulp.dest( config.paths.app.vendor ) );

} );
