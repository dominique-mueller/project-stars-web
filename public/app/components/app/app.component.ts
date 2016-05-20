/**
 * External imports
 */
import { Component, OnInit } from '@angular/core';
import { ROUTER_PROVIDERS, ROUTER_DIRECTIVES, Router, Routes, Route } from '@angular/router';
import { HTTP_PROVIDERS } from '@angular/http';
import { provideStore } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';

/**
 * Internal imports
 */
import { AppService } from './../../services/app';
import { bookmarks } from './../../services/bookmark';
import { folders } from './../../services/folder';
import { labels } from './../../services/label';
import { ui, UiService } from './../../services/ui';
import { user } from './../../services/user';
import { BookmarksComponent } from './../bookmarks/bookmarks.component';
import { LoginComponent } from './../login/login.component';
import { DialogConfirmService } from './../../shared/dialog-confirm/dialog-confirm.service';
import { DialogConfirmComponent } from './../../shared/dialog-confirm/dialog-confirm.component';

/**
 * View component (smart): App
 */
@Component( {
	directives: [
		ROUTER_DIRECTIVES,
		DialogConfirmComponent
	],
	providers: [
		HTTP_PROVIDERS,
		ROUTER_PROVIDERS,
		provideStore( {
			bookmarks,
			folders,
			labels,
			ui,
			user
		} ),
		AppService,
		UiService,
		DialogConfirmService
	],
	selector: 'app',
	templateUrl: './app.component.html'
} )
@Routes( [
	new Route( {
		component: LoginComponent,
		path: '/login'
	} ),
	new Route( {
		component: BookmarksComponent,
		path: '/bookmarks'
	} )
	// TODO: Settings route, Register route ...
] )
export class AppComponent implements OnInit {

	/**
	 * Router
	 */
	private router: Router;

	/**
	 * Constructor
	 */
	constructor( router: Router ) {

		// Initialize
		this.router = router;

	}

	public ngOnInit(): void {

		// TODO: Route depending on login status, only when on root
		// this.router.navigate( [ 'bookmarks' ] ); // Absolute

	}

}
