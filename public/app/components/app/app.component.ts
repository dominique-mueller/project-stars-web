/**
 * External imports
 */
import { Component } from 'angular2/core';
import { HTTP_PROVIDERS } from 'angular2/http';
import { ROUTER_PROVIDERS, ROUTER_DIRECTIVES, RouteConfig, Router } from 'angular2/router';

/**
 * Internal imports
 */
import { AppService } from '../../services/app/app.service';
import { BookmarksComponent } from '../bookmarks/bookmarks.component';

/**
 * App Component
 */
@Component( {
	directives: [
		ROUTER_DIRECTIVES
	],
	providers: [
		HTTP_PROVIDERS,
		ROUTER_PROVIDERS,
		AppService
	],
	selector: 'app',
	templateUrl: './app.component.html'
} )
@RouteConfig( [
	{
		component: BookmarksComponent,
		name: 'Bookmarks',
		path: '/bookmarks/...'
	}
] )
export class AppComponent {

	// TODO: Decide which route to take depending on whether we are logged in or not

	private router: Router;

	constructor( router: Router ) {
		this.router = router;
	}

	private doIt(): void {
		this.router.navigate( [ 'Bookmarks' ] );
	}

}
