/**
 * External imports
 */
import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { FORM_DIRECTIVES, FormBuilder, ControlGroup, Control } from '@angular/common';
import { Router, RouteSegment, RouteTree, OnActivate } from '@angular/router';

/**
 * Internal imports
 */
import { AppService } from './../../services/app';
import { UserAuthService } from './../../services/user';
import { UiService } from './../../services/ui';
import { NotifierService } from './../../shared/notifier/notifier.service';
import { IconComponent } from './../../shared/icon/icon.component';
import { LoaderComponent } from './../../shared/loader/loader.component';

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
	 */
	constructor(
		changeDetector: ChangeDetectorRef,
		router: Router,
		appService: AppService,
		userAuthService: UserAuthService,
		uiService: UiService,
		notifierService: NotifierService,
		formBuilder: FormBuilder
	) {

		// Initialize
		this.changeDetector = changeDetector;
		this.router = router;
		this.appService = appService;
		this.userAuthService = userAuthService;
		this.uiService = uiService;
		this.notifierService = notifierService;

		// Setup
		this.appName = this.appService.APP_NAME;
		this.loginForm = formBuilder.group( {
			email: '',
			password: ''
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

		// Enable animation, collect data from the login form
		this.isAnimChecking = true;
		let email: string = this.loginForm.value.email;
		let password: string = this.loginForm.value.password;

		// Try to authenticate the user, the login and navigate to the bookmarks view
		this.userAuthService.loginUser( email, password )

			// Success
			.then( ( data: any ) => {
				console.log( 'APP > Login Component > Login successful.' );
				this.router.navigate( [ 'bookmarks' ] ); // Absolute
				this.isAnimChecking = false;
			} )

			// Error
			.catch( ( error: any ) => {
				console.log( 'APP > Login Component > Login not successful.' );

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
