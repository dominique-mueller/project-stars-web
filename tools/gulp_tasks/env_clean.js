/**
 * Imports
 */
import config 	from './config.json'
import del 		from 'del';
import gulp 	from 'gulp';

/**
 * Gulp task
 * ---------
 * Clean build folder (including all files)
 */
export default gulp.task( 'env:clean', () => {

	// Delete folder and files
	return del( [
		`${config.paths.app.dest}/**/*`
	] );

} );
