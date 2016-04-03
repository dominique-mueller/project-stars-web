/**
 * External imports
 */
import { Component, OnInit } from 'angular2/core';
import { HTTP_PROVIDERS } from 'angular2/http';
import { ROUTER_PROVIDERS, ROUTER_DIRECTIVES, RouteConfig } from 'angular2/router';
import { provideStore } from '@ngrx/store';

/**
 * Internal imports
 */
import { AppService } from '../../services/app/app.service';
import { bookmarks } from './../../services/bookmark/bookmark.store';
import { folders } from './../../services/folder/folder.store';
import { labels } from './../../services/label/label.store';
import { ui } from './../../services/ui/ui.store';
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
		provideStore( {
			bookmarks,
			folders,
			labels,
			ui
		} ),
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

}
