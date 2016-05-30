'use strict';

/**
 * Import configuration
 */
const config = require( './../config.json' );

/**
 * Gulp imports
 */
const gulp = require( 'gulp' );
const gutil = require( 'gulp-util' );

/**
 * Gulp task: Setup temp API mock data
 * TODO: Remove me when merging frontend with backend is finally done
 */
gulp.task( 'setup:apimock', () => {
	gutil.log( '> TODO: Setting up the fake API should be removed!' );
	return gulp
		.src( [
			`${ config.paths.project.scripts }/services/bookmark/bookmarks.mock.json`,
			`${ config.paths.project.scripts }/services/folder/folders.mock.json`,
			`${ config.paths.project.scripts }/services/label/labels.mock.json`,
			`${ config.paths.project.scripts }/services/user/user.mock.json`,
			`${ config.paths.project.scripts }/services/user/jwt.mock.json`
		] )
		.pipe( gulp.dest( `${ config.paths.project.dest }/apimock` ) );
} );
