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
	.then( ( success: any ) => {
		console.clear(); // TODO: Remove me ?!
		console.log( 'Angular 2 app has successfully started!' );
	} )
	.catch( ( error: any ) => {
		console.log( 'Angular 2 bootstrap error.' );
		console.log( error );
	} );
