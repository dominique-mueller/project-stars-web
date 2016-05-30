'use strict';

/**
 * Import configuration
 */
const config = require( './../config.json' );

/**
 * Gulp imports
 */
const browserSync = require( 'browser-sync' );
const gulp = require( 'gulp' );
const htmlmin = require( 'gulp-htmlmin' );
const htmlminOptions = require( './../../.htmlminrc.json' );
const inject = require( 'gulp-inject' );
const inlinesource = require( 'gulp-inline-source' );
const rename = require( 'gulp-rename' );
const svgstore = require( 'gulp-svgstore' );

/**
 * Gulp task: Setup index file (for development)
 */
gulp.task( 'setup:index--dev', () => {

	// First up, get all SVG icons, prefix them and save them temporarily
	let tempSvgStore = gulp
		.src( `${ config.paths.assets.icons }/*.svg` )
		.pipe( rename( {
			prefix: 'icon-'
		} ) )
		.pipe( svgstore( {
			inlineSvg: true
		} ) );

	// Then process the index file
	return gulp
		.src( `${ config.paths.project.base }/index.html` )

		// Inject stylesheet link
		.pipe( inject(
			gulp.src( `${ config.paths.project.dest }/style.css`, {
				read: false
			} ), {
				transform: ( path, file ) => {
					return `<link rel="stylesheet" href="${ path }">`;
				}
			}
		) )

		// Inject inline stylesheet link
		.pipe( inject(
			gulp.src( `${ config.paths.project.dest }/style-inline.css`, {
				read: false
			} ), {
				starttag: '<!-- inject:css:inline -->', // Special annotation for this, else it would override the injections from above
				transform: ( path, file ) => {
					return `<link rel="stylesheet" href="${ path }">`;
				}
			}
		) )

		// Inject required JS libraries, directly from the node modules folder
		.pipe( inject(
			gulp.src( [
				`${ config.paths.dependencies }/core-js/client/shim.min.js`,
				`${ config.paths.dependencies }/zone.js/dist/zone.js`,
				`${ config.paths.dependencies }/reflect-metadata/Reflect.js`,
				`${ config.paths.dependencies }/systemjs/dist/system.src.js`
			], { read: false } ),
			{
				transform: ( path, file ) => {
					return `<script src="${ path }"></script>`;
				}
			}
		) )

		// Inject configuration files, with updated path (at this moment for TypeKit and SystemJS)
		.pipe( inject(
			gulp.src( [
				`${ config.paths.project.base }/systemjs.config.js`,
				`${ config.paths.project.base }/typekit.config.js`
			], { read: false } ), {
				starttag: '<!-- inject:js:inline -->', // Special annotation for this, else it would override the injections from above
				transform: ( path, file ) => {
					return `<script src="${ path.replace( 'public', 'build' ) }"></script>`;
				}
			}
		) )

		// Inject SVG icons
		.pipe( inject(
			tempSvgStore, {
				transform: ( path, file ) => {
					return file.contents.toString();
				}
			}
		) )

		.pipe( gulp.dest( config.paths.root ) )
		.pipe( browserSync.stream( { once: true } ) );

} );

/**
 * Gulp task: Setup index file (for production)
 */
gulp.task( 'setup:index--prod', () => {

	// First up, get all SVG icons, prefix them and save them temporarily
	let tempSvgStore = gulp
		.src( `${ config.paths.assets.icons }/*.svg` )
		.pipe( rename( {
			prefix: 'icon-'
		} ) )
		.pipe( svgstore( {
			inlineSvg: true
		} ) );

	// Then process the index file
	return gulp
		.src( `${ config.paths.project.base }/index.html` )

		// Inject stylesheet link
		.pipe( inject(
			gulp.src( `${ config.paths.project.dest }/style.min.css`, {
				read: false
			} ), {
				transform: ( path, file ) => {
					return `<link rel="stylesheet" href="${ path }">`;
				}
			}
		) )

		// Inject inline stylesheet link
		.pipe( inject(
			gulp.src( `${ config.paths.project.dest }/temp/style-inline.min.css`,
			{ read: false } ), {
				starttag: '<!-- inject:css:inline -->', // Special annotation for this, else it would override the injections from above
				transform: ( path, file ) => {
					return `<link rel="stylesheet" href="${ path }" inline>`;
				}
			}
		) )

		// Inject generated bundles
		.pipe( inject(
			gulp.src( [
				`${ config.paths.project.dest }/polyfills.bundle.min.js`,
				`${ config.paths.project.dest }/vendor.bundle.min.js`,
				`${ config.paths.project.dest }/app.bundle.min.js`
			], { read: false } ),
			{
				transform: ( path, file ) => {
					return `<script src="${ path }"></script>`;
				}
			}
		) )

		// Inject configuration files, with original path and inline argument (at this moment for TypeKit and SystemJS)
		.pipe( inject(
			gulp.src( [
				`${ config.paths.project.base }/systemjs.config.js`,
				`${ config.paths.project.base }/typekit.config.js`
			], { read: false } ), {
				starttag: '<!-- inject:js:inline -->', // Special annotation for this, else it would override the injections from above
				transform: ( path, file ) => {
					return `<script src="${ path }" inline></script>`;
				}
			}
		) )

		// Inline sources
		.pipe( inlinesource( {
			compress: true,
			rootpath: config.paths.root // Set the root path explicitely
		} ) )

		// Inject SVG icons
		.pipe( inject(
			tempSvgStore, {
				transform: ( path, file ) => {
					return file.contents.toString();
				}
			}
		) )

		// Lastly, minify the HTML code
		.pipe( htmlmin( htmlminOptions ) )

		.pipe( gulp.dest( config.paths.root ) );

} );
