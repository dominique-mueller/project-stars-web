/**
 * External imports
 */
import { provide } from 'angular2/core';
import { APP_BASE_HREF } from 'angular2/router';
import { bootstrap } from 'angular2/platform/browser';

/**
 * Internal imports
 */
import { AppComponent } from './components/app/app.component';

/**
 * Bootstrap Angular 2
 */
bootstrap( AppComponent, [
		provide( APP_BASE_HREF, { useValue: '/' } )
	] )
	.then( () => {
		console.clear(); // TODO: Remove me ?!
		console.log( 'App successfully started!' );
	} )
	.catch( ( error: any ) => {
		console.log( 'An error occured while starting this app!' );
		console.log( 'Details:' );
		console.log( error );
	} );
