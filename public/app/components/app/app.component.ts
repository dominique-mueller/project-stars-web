/**
 * App component
 */

/**
 * External imports
 */
import { Component, OnInit, provide } from '@angular/core';
import { FORM_PROVIDERS, Location } from '@angular/common';
import { ROUTER_PROVIDERS, ROUTER_DIRECTIVES, Router, Routes, Route } from '@angular/router';
import { HTTP_PROVIDERS, Http } from '@angular/http';
import { AUTH_PROVIDERS, AuthConfig, AuthHttp, JwtHelper } from 'angular2-jwt';
import { provideStore } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';

/**
 * Internal imports
 */
import { AppService } from './../../services/app';
import { bookmarkReducer } from './../../services/bookmark';
import { folderReducer } from './../../services/folder';
import { labelReducer } from './../../services/label';
import { uiReducer, UiService } from './../../services/ui';
import { userReducer, UserAuthService } from './../../services/user';
import { BookmarksComponent } from './../bookmarks/bookmarks.component';
import { LoginComponent } from './../login/login.component';
import { DialogConfirmService } from './../../shared/dialog-confirm/dialog-confirm.service';
import { DialogConfirmComponent } from './../../shared/dialog-confirm/dialog-confirm.component';
import { NotifierService } from './../../shared/notifier/notifier.service';
import { NotifierComponent } from './../../shared/notifier/notifier.component';

/**
 * View component (ROOT): App
 */
@Component( {
	directives: [
		ROUTER_DIRECTIVES,
		DialogConfirmComponent,
		NotifierComponent
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
		NotifierService,
		provideStore( { // Setup the redux store as a combination of seperate reducers
			bookmarks: bookmarkReducer,
			folders: folderReducer,
			labels: labelReducer,
			ui: uiReducer,
			user: userReducer
		} ),
		provide( AuthHttp, { // Setup the authenticated HTTP service (provided by module)
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
						headerName: 'Authorization', // Standard
						headerPrefix: 'Bearer',
						noJwtError: true, // We do this manually
						tokenName: 'jwt' // Name for the local storage entry
					} ),
					http
				);
			}
		} )
	],
	selector: 'app-root',
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
	} ),
	// Hacky 'otherwhise' functionality, redirects to bookmarks over login
	// We do this because of issues occuring when redirecting directly to the bookmarks route
	new Route( {
		component: LoginComponent,
		path: '*'
	} )
] )
export class AppComponent implements OnInit {

	/**
	 * Router
	 */
	private router: Router;

	/**
	 * Location
	 */
	private location: Location;

	/**
	 * User authentication service
	 */
	private userAuthService: UserAuthService;

	/**
	 * Constructor
	 */
	constructor(
		router: Router,
		location: Location,
		userAuthService: UserAuthService
	) {

		// Initialize
		this.router = router;
		this.location = location;
		this.userAuthService = userAuthService;

	}

	/**
	 * Call this when the view gets initialized
	 */
	public ngOnInit(): void {

		// Only redirect automatically when we're loading at the root
		if ( this.location.path() === '' ) {

			// This component is the root component and basically just acts as a root container
			// So when visiting this page, we just navigated to the root project URL
			// Therefore we redirect instantly depending on whether we're logged in or not
			if ( this.userAuthService.isUserLoggedIn() ) {
				this.router.navigate( [ 'bookmarks' ] ); // Absolute
			} else {
				this.router.navigate( [ 'login' ] ); // Absolute
			}

		}

	}

}
