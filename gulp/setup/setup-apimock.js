'use strict';

/**
 * Import configuration
 */
const config = require( './../config.json' );

/**
 * Gulp imports
 */
const gulp = require( 'gulp' );

/**
 * Gulp task: Setup temp API mock data (for dev only)
 * TODO: Remove me when merging frontend with backend is finally done
 */
gulp.task( 'setup:apimock', () => {
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
