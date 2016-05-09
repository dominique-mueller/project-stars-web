/**
 * External imports
 */
import { Component, OnInit } from '@angular/core';
import { HTTP_PROVIDERS } from '@angular/http';
import { ROUTER_PROVIDERS, ROUTER_DIRECTIVES, Routes, Route } from '@angular/router';
import { provideStore } from '@ngrx/store';

/**
 * Internal imports
 */
import { AppService } from './../../services/app';
import { bookmarks } from './../../services/bookmark';
import { folders } from './../../services/folder';
import { labels } from './../../services/label';
import { ui } from './../../services/ui';
import { BookmarksComponent } from './../bookmarks/bookmarks.component';

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
@Routes( [
	new Route( {
		component: BookmarksComponent,
		path: '/bookmarks'
	} )
	// TODO: Settings Route, Login Route, ...
] )
export class AppComponent {

	// TODO: Decide which route to take depending on whether we are logged in or not

}
