/**
 * Imports
 */
import { Component } from 'angular2/core';
import { HTTP_PROVIDERS } from 'angular2/http';
import { ROUTER_PROVIDERS, ROUTER_DIRECTIVES, RouteConfig } from 'angular2/router';
import { BookmarksComponent } from '../bookmarks/bookmarks.component';

/**
 * App Component
 */
@Component( {
	directives: [ ROUTER_DIRECTIVES ],
	providers: [ HTTP_PROVIDERS, ROUTER_PROVIDERS ],
	selector: 'app',
	templateUrl: './app.component.html'
} )
@RouteConfig( [
	{
		component: BookmarksComponent,
		name: 'Bookmarks',
		path: '/bookmarks/...'
	}
	// {
	// 	component: BookmarksComponent,
	// 	regex: 'bookmarks/(.*)$',
	// 	serializer: ( params ) => `bookmarks/${ params[0] }`
	// }
	// {
	// 	'path': '/**',
	// 	'redirectTo': [ 'Bookmarks' ]
	// }
] )
export class AppComponent {

	// TODO: Decide which route to take depending on whether we are logged in or not

}
