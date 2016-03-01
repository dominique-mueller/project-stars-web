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
 * ncu options
 */
const ncuOptions = {
	'packageFile': './package.json'
};

/**
 * Gulp task: Clean build folder
 */
export const envClean = gulp.task( 'env:clean', () => {

	// Delete folder and files
	return del( `${config.paths.app.dest}/**/*` );

} );

/**
 * Gulp task: Check for NPM dependency upgrades
 */
export const envNpm = gulp.task( 'env:npm', () => {

	// Check for npm dependency updates
	ncu.run( ncuOptions ).then( ( results ) => {

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

	return gulp

		// Get all typescript files
		.src( [
			`${config.paths.project.src}/index.html`,
			'./node_modules/angular2/bundles/angular2-polyfills.js'
		] )

		// Report problems
		.pipe( gulp.dest( config.paths.project.dest ) );

} );
