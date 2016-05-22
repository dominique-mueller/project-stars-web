/**
 * External imports
 */
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FORM_DIRECTIVES, FormBuilder, ControlGroup, Control } from '@angular/common';
import { Router, RouteSegment, RouteTree, OnActivate } from '@angular/router';

/**
 * Internal imports
 */
import { AppService } from './../../services/app';
import { UserAuthService } from './../../services/user';
import { IconComponent } from './../../shared/icon/icon.component';

/**
 * View component (smart): Login
 */
@Component( {
	changeDetection: ChangeDetectionStrategy.OnPush,
	directives: [
		FORM_DIRECTIVES,
		IconComponent
	],
	host: {
		class: 'login'
	},
	selector: 'app-login',
	templateUrl: './login.component.html'
} )
export class LoginComponent implements OnActivate {

	/**
	 * Router
	 */
	private router: Router;

	/**
	 * App service
	 */
	private appService: AppService;

	/**
	 * User authentication service
	 */
	private userAuthService: UserAuthService;

	/**
	 * App name
	 */
	private appName: string;

	/**
	 * Login form model
	 */
	private loginForm: ControlGroup;

	/**
	 * Constructor
	 */
	constructor(
		router: Router,
		appService: AppService,
		userAuthService: UserAuthService,
		formBuilder: FormBuilder
	) {

		// Initialize
		this.router = router;
		this.appService = appService;
		this.userAuthService = userAuthService;

		// Setup
		this.appName = this.appService.APP_NAME;
		this.loginForm = formBuilder.group( {
			email: '',
			password: ''
		} );

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

	}

	/**
	 * Submit the login form
	 */
	public onSubmit(): void {

		// Collect form data
		let email: string = this.loginForm.value.email;
		let password: string = this.loginForm.value.password;

		// Try to authenticate the user, the login and navigate to the bookmarks view
		this.userAuthService.loginUser( email, password )

			// Success
			.then( ( data: any ) => {
				console.log( 'APP > User > Login successful.' );
				this.router.navigate( [ 'bookmarks' ] ); // Absolute
			} )

			// Error
			.catch( ( error: any ) => {
				console.warn( 'APP > User > Login not successful.' );
				( <Control> this.loginForm.controls[ 'password' ] ).updateValue( '' ); // Reset password input
			} );

	}

}

