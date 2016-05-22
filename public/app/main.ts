/**
 * External imports
 */
import { provide, enableProdMode } from '@angular/core';
import { APP_BASE_HREF } from '@angular/common';
import { bootstrap } from '@angular/platform-browser-dynamic';
import { Title } from '@angular/platform-browser';

/**
 * Internal imports
 */
import { AppComponent } from './components/app/app.component';

// TODO: Move prod move status into some king of env file
// enableProdMode();

/**
 * Bootstrap the application for the browser
 */
bootstrap( AppComponent, [
		Title,
		{
			provide: APP_BASE_HREF,
			useValue: '/'
		}
	] )
	.then( () => {
		console.log( 'APP > Application bootstrap successfully finished!' );
	} )
	.catch( ( error: any ) => {
		console.warn( 'APP > An error occured while starting this app.' );
		console.dir( error );
	} );
