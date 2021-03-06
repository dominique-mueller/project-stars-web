/**
 * File: Login component
 */

import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { FORM_DIRECTIVES, FormBuilder, ControlGroup, Control, Validators, Location } from '@angular/common';
import { Router, RouteSegment, RouteTree, OnActivate } from '@angular/router';

import { AppService } from './../../services/app';
import { UserAuthService } from './../../services/user';
import { UiService } from './../../services/ui';
import { IconComponent, LoaderComponent, NotifierService } from './../../shared';

/**
 * View component (smart): Login
 */
@Component( {
	changeDetection: ChangeDetectionStrategy.OnPush,
	directives: [
		FORM_DIRECTIVES,
		IconComponent,
		LoaderComponent
	],
	host: {
		class: 'login',
		'[class.is-visible]': 'isAnimLoaded',
		'[class.is-error]': 'isAnimError',
		'[class.is-checking]': 'isAnimChecking'
	},
	selector: 'app-login',
	templateUrl: './login.component.html'
} )
export class LoginComponent implements OnActivate, OnInit {

	/**
	 * Change detector
	 */
	private changeDetector: ChangeDetectorRef;

	/**
	 * Router
	 */
	private router: Router;

	/**
	 * Location
	 */
	private location: Location;

	/**
	 * App service
	 */
	private appService: AppService;

	/**
	 * User authentication service
	 */
	private userAuthService: UserAuthService;

	/**
	 * UI service
	 */
	private uiService: UiService;

	/**
	 * Notifier service
	 */
	private notifierService: NotifierService;

	/**
	 * App name
	 */
	private appName: string;

	/**
	 * Login form model
	 */
	private loginForm: ControlGroup;

	/**
	 * Animation flag, for initial loading
	 */
	private isAnimLoaded: boolean;

	/**
	 * Animation flag, when login try unsuccessful
	 */
	private isAnimError: boolean;

	/**
	 * Animation flag, when checking login submit
	 */
	private isAnimChecking: boolean;

	/**
	 * Constructor
	 * @param {ChangeDetectorRef} changeDetector  Change detector
	 * @param {Router}            router          Router
	 * @param {Location}          location        Location
	 * @param {AppService}        appService      App service
	 * @param {UserAuthService}   userAuthService User authentication service
	 * @param {UiService}         uiService       UI service
	 * @param {NotifierService}   notifierService Notifier service
	 * @param {FormBuilder}       formBuilder     Form builder
	 */
	constructor(
		changeDetector: ChangeDetectorRef,
		router: Router,
		location: Location,
		appService: AppService,
		userAuthService: UserAuthService,
		uiService: UiService,
		notifierService: NotifierService,
		formBuilder: FormBuilder
	) {

		// Initialize
		this.changeDetector = changeDetector;
		this.router = router;
		this.location = location;
		this.appService = appService;
		this.userAuthService = userAuthService;
		this.uiService = uiService;
		this.notifierService = notifierService;

		// Setup
		this.appName = this.appService.APP_NAME;
		this.loginForm = formBuilder.group( {
			email: [ '', Validators.required ],
			password: [ '', Validators.required ]
		} );
		this.isAnimLoaded = false;
		this.isAnimError = false;
		this.isAnimChecking = false;

	}

	/**
	 * Call this when the router gets activated
	 * This function only handles stuff that has to do with routing
	 */
	public routerOnActivate( curr: RouteSegment, prev?: RouteSegment, currTree?: RouteTree, prevTree?: RouteTree ): void {

		// Redirect into the application when the user is actually (and corretly) logged in
		if ( this.userAuthService.isUserLoggedIn() ) {
			this.router.navigate( [ 'bookmarks' ] ); // Absolute
		}

		// 'Otherwise' fallback for the app component, redirects instantly to the bookmarks route
		if ( this.location.path() !== '/login' ) {
			this.router.navigate( [ 'bookmarks' ] ); // Absolute
		}

	}

	/**
	 * Call this when the view gets initialized
	 */
	public ngOnInit(): void {
		this.uiService.setDocumentTitle( 'Login' );
		setTimeout( () => {
			this.isAnimLoaded = true;
			this.changeDetector.markForCheck(); // Trigger change detection
		} );
	}

	/**
	 * Submit the login form
	 */
	public onSubmit(): void {

		// Skip of the login form is empty
		if ( this.loginForm.value.email.length === 0 || this.loginForm.value.password.lenth === 0 ) {
			this.notifierService.notify( 'default', 'Please enter your e-mail address and password.' );
			return;
		}

		// Try to authenticate the user, the login and navigate to the bookmarks view
		this.isAnimChecking = true;
		this.userAuthService.loginUser( this.loginForm.value.email, this.loginForm.value.password )

			// Success
			.then( ( data: any ) => {
				this.router.navigate( [ 'bookmarks' ] ); // Absolute
				this.isAnimChecking = false;
			} )

			// Error
			.catch( ( error: any ) => {

				// Reset password input, notify user
				( <Control> this.loginForm.controls[ 'password' ] ).updateValue( '' );
				this.notifierService.notify( 'default', 'Login unsuccessful. Please check your e-mail and password.' );

				// Shake animation
				this.isAnimChecking = false;
				this.isAnimError = true;
				this.changeDetector.markForCheck(); // Trigger change detection
				setTimeout(
					() => {
						this.isAnimError = false;
						this.changeDetector.markForCheck(); // Trigger change detection
					},
					1140 // Animation takes a bit more than 1 second, so give it 100ms more than it actually needs
				);

			} );

	}

}
