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
 */
bootstrap( AppComponent, [
		Title,
		{
			provide: APP_BASE_HREF,
			useValue: '/'
		}
	] )
	.then( () => {
		window.console.clear(); // TODO: Remove me ?!
		window.console.info( 'App successfully started!' );
	} )
	.catch( ( error: any ) => {
		window.console.warn('An error occured while starting this app!');
		window.console.log(error);
	} );
