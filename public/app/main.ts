/**
 * File: Main application entry
 */

import { provide, enableProdMode } from '@angular/core';
import { APP_BASE_HREF } from '@angular/common';
import { bootstrap } from '@angular/platform-browser-dynamic';
import { Title } from '@angular/platform-browser';

import { AppComponent } from './components/app/app.component';

// Set the environment
if ( '@@CONFIG_ENV' === 'prod' ) { // Will be replaced by the Gulp build process
	enableProdMode(); // PERF BOOOOOOOOOOOST ... MAKE IT FAAAAAAAST ...
}

// Bootstrap the application for the browser
bootstrap( AppComponent, [
		Title,
		{
			provide: APP_BASE_HREF,
			useValue: '/' // Base URL (necessary because not set in index.html)
		}
	] )
	.then( ( data: any ) => {
		console.log( 'APP > Application bootstrap successfully finished!' );
	} )
	.catch( ( error: any ) => {
		console.log( 'APP > An error occured while starting this app.' );
		console.log( error );
	} );
