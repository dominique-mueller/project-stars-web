/**
 * External imports
 */
import { provide } from '@angular/core';
import { APP_BASE_HREF } from '@angular/common';
import { bootstrap } from '@angular/platform-browser-dynamic';
import { Title } from '@angular/platform-browser';

/**
 * Internal imports
 */
import { AppComponent } from './components/app/app.component';

/**
 * Bootstrap the application for the browser
 * TODO: Find a better way of error handling here
 */
bootstrap( AppComponent, [
		Title,
		{
			provide: APP_BASE_HREF,
			useValue: '/'
		}
	] )
	.then( () => {
		window.console.clear();
		window.console.info( 'App successfully started!' );
	} )
	.catch( ( error: any ) => {
		window.console.warn( 'ERROR: An error occured while starting this app.' );
		window.console.log( error );
		alert(
			`ERROR:

An error occured while starting this app.
More details can be found in the browser developer console (press F12).`
		);
	} );
