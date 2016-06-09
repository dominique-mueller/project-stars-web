'use strict';

/**
 * Import configuration
 */
const gulpConfig = require( './../gulp.config.json' );

/**
 * Gulp imports
 */
const gulp 	= require( 'gulp-help' )( require( 'gulp' ) );
const gutil = require( 'gulp-util' );

/**
 * Gulp task: Setup temp API mock data
 * TODO: Remove me when merging frontend with backend is finally done
 */
gulp.task( 'setup:apimock', 'TO BE REMOVED: Setup API mocks', () => {
	gutil.log( gutil.colors.red( 'TODO: Setting up the API mock should be removed!' ) );
	return gulp
		.src( [
			`${ gulpConfig.paths.project.scripts }/services/bookmark/bookmarks.mock.json`,
			`${ gulpConfig.paths.project.scripts }/services/folder/folders.mock.json`,
			`${ gulpConfig.paths.project.scripts }/services/label/labels.mock.json`,
			`${ gulpConfig.paths.project.scripts }/services/user/user.mock.json`,
			`${ gulpConfig.paths.project.scripts }/services/user/jwt.mock.json`
		] )
		.pipe( gulp.dest( `${ gulpConfig.paths.project.dest }/apimock` ) );
} );
