/**
 * Imports
 */
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
 * npm env gulp task
 */
export default gulp.task( 'env.npm', () => {

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
