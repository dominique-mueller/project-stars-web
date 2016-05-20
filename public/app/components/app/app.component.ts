/**
 * External imports
 */
import { Component, OnInit, provide } from '@angular/core';
import { FORM_PROVIDERS } from '@angular/common';
import { ROUTER_PROVIDERS, ROUTER_DIRECTIVES, Router, Routes, Route } from '@angular/router';
import { HTTP_PROVIDERS, Http } from '@angular/http';
import { AUTH_PROVIDERS, AuthConfig, AuthHttp, JwtHelper } from 'angular2-jwt';
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
import { user, UserAuthService } from './../../services/user';
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
		FORM_PROVIDERS,
		HTTP_PROVIDERS,
		AUTH_PROVIDERS,
		ROUTER_PROVIDERS,
		AppService,
		UiService,
		UserAuthService,
		JwtHelper,
		DialogConfirmService,
		provideStore( {
			bookmarks,
			folders,
			labels,
			ui,
			user
		} ),
		provide( AuthHttp, {
			deps: [
				Http
			],
			useFactory: ( http: Http ): AuthHttp => {
				return new AuthHttp(
					new AuthConfig( {
						globalHeaders: [
							{
								'Content-Type': 'application/json'
							}
						],
						headerName: 'X-AUTHORIZATION', // Special field
						headerPrefix: 'Bearer',
						noJwtError: true, // We do this manually
						tokenName: 'jwt' // Name for the local storage entry
					} ),
					http
				);
			}
		} )
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
