/**
 * Imports
 */
import { bootstrap } from 'angular2/platform/browser';
import { AppComponent } from './layout/app/app.component';

/**
 * Bootstrap Angular 2
 */
bootstrap( AppComponent )
	.then( ( success: any ) => {
		console.log( 'Angular 2 bootstrap success.' );
	} )
	.catch( ( error: any ) => {
		console.log( 'Angular 2 bootstrap error.' );
		console.log( error );
	} );
