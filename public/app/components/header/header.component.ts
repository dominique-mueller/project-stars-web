/**
 * File: Header component
 */

/**
 * External imports
 */
import { Component, Output, EventEmitter, OnInit, OnDestroy, ChangeDetectionStrategy,
	ChangeDetectorRef } from '@angular/core';
import { FORM_DIRECTIVES, FormBuilder, ControlGroup, Control } from '@angular/common';
import { ROUTER_DIRECTIVES } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/debounceTime';
import { List, Map } from 'immutable';

/**
 * Internal imports
 */
import { AppService } from './../../services/app';
import { UiService } from './../../services/ui';
import { UserDataService, User } from './../../services/user';
import { DropdownComponent, DropdownItem, IconComponent, NotifierService } from './../../shared';

/**
 * View component (smart): Header
 */
@Component( {
	changeDetection: ChangeDetectionStrategy.OnPush,
	directives: [
		ROUTER_DIRECTIVES,
		FORM_DIRECTIVES,
		DropdownComponent,
		IconComponent
	],
	selector: 'app-header',
	templateUrl: './header.component.html'
} )
export class HeaderComponent implements OnInit, OnDestroy {

	/**
	 * Output: Change search event, emits search parameters
	 */
	@Output()
	private changeSearch: EventEmitter<any>;

	/**
	 * Output: Logout event, emitting nothing
	 */
	@Output()
	private logout: EventEmitter<any>;

	/**
	 * Change detector
	 */
	private changeDetector: ChangeDetectorRef;

	/**
	 * App service
	 */
	private appService: AppService;

	/**
	 * User data service
	 */
	private userDataService: UserDataService;

	/**
	 * UI service
	 */
	private uiService: UiService;

	/**
	 * Notifier service
	 */
	private notifierService: NotifierService;

	/**
	 * List containing all service subscriptions
	 */
	private serviceSubscriptions: Array<Subscription>;

	/**
	 * Search form model
	 */
	private searchForm: ControlGroup;

	/**
	 * App name
	 */
	private appName: string;

	/**
	 * Flag for temporarily disabling the change search event emitting
	 */
	private isChangeSearchDisabled: boolean;

	/**
	 * List of dropdown items
	 */
	private dropdownItems: List<DropdownItem>;

	/**
	 * Full user name
	 */
	private userName: string;

	/**
	 * Constructor
	 * @param {ChangeDetectorRef} changeDetector  Change detector
	 * @param {AppService}        appService      App service
	 * @param {UiService}         uiService       UI service
	 * @param {UserDataService}   userDataService User data service
	 * @param {NotifierService}   notifierService Notifier service
	 * @param {FormBuilder}       formBuilder     Form builder
	 */
	constructor(
		changeDetector: ChangeDetectorRef,
		appService: AppService,
		uiService: UiService,
		userDataService: UserDataService,
		notifierService: NotifierService,
		formBuilder: FormBuilder
	) {

		// Initialize
		this.changeDetector = changeDetector;
		this.appService = appService;
		this.uiService = uiService;
		this.userDataService = userDataService;
		this.notifierService = notifierService;

		// Setup
		this.changeSearch = new EventEmitter();
		this.logout = new EventEmitter();
		this.isChangeSearchDisabled = false;
		this.appName = appService.APP_NAME;
		this.userName = 'User';
		this.serviceSubscriptions = [];
		this.searchForm = formBuilder.group( {
			text: ''
		} );

		// Setup dropdown values
		this.dropdownItems = List<DropdownItem>( [
			<DropdownItem> Map<string, any>( {
				icon: 'settings', label: 'Settings', type: 'link', value: 'settings'
			} ),
			<DropdownItem> Map<string, any>( {
				icon: 'download', label: 'Apps', type: 'link', value: 'apps'
			} ),
			<DropdownItem> Map<string, any>( {
				type: 'divider'
			} ),
			<DropdownItem> Map<string, any>( {
				icon: 'help', label: 'Help', type: 'link', value: 'help'
			} ),
			<DropdownItem> Map<string, any>( {
				icon: 'heart', label: 'Feedback', type: 'link', value: 'feedback'
			} ),
			<DropdownItem> Map<string, any>( {
				icon: 'info', label: 'About', type: 'link', value: 'about'
			} ),
			<DropdownItem> Map<string, any>( {
				type: 'divider'
			} ),
			<DropdownItem> Map<string, any>( {
				icon: 'exit', label: 'Logout', type: 'link', value: 'logout'
			} )
		] );

	}

	/**
	 * Call this when the view gets initialized
	 */
	public ngOnInit(): void {

		// Get notified when the search parameters change
		const searchFormSubscription: Subscription = this.searchForm.valueChanges
			.debounceTime( 150 ) // Debounce in ms
			.subscribe(
				( formData: any ) => {

					// Do not emit the change search event if the change actually came from the UI service
					if ( this.isChangeSearchDisabled ) {
						this.isChangeSearchDisabled = false; // Disabling for one round done
					} else {
						this.onSubmitSearch();
					}

				}
			);

		// Get informed when the search parameters change from outside
		// For example, this might happen when interacting with the search result items (which trigger routing by themself)
		const uiServiceSubscription: Subscription = this.uiService.uiState.subscribe(
			( uiState: Map<string, any> ) => {

				// Update search parameters (only when the value actually changed)
				// This should only fire once, when the search route gets directly called / reloaded
				if ( uiState.getIn( [ 'search', 'text' ] ) !== this.searchForm.value.text ) {

					// Skip the change search event emitting for one round
					// We do this because at this time routing already happens in another component
					this.isChangeSearchDisabled = true;

					// Update search text
					( <Control> this.searchForm.controls[ 'text' ] ) // Case form AbstractControl
						.updateValue( uiState.getIn( [ 'search', 'text' ] ) );

				}

			}

		);

		// Get notified when the user changes
		const userDataServiceSubscription: Subscription = this.userDataService.user.subscribe(
			( user: User ) => {

				// Save full user name
				if ( user.get( 'firstName' ) !== null && user.get( 'lastName' ) !== null ) {
					this.userName = `${ user.get( 'firstName' ) } ${ user.get( 'lastName' ) }`;
					this.changeDetector.markForCheck(); // Trigger change detection
				}

			}
		);

		// Save subscriptions
		this.serviceSubscriptions = [
			searchFormSubscription,
			uiServiceSubscription,
			userDataServiceSubscription
		];

	}

	/**
	 * Call this when the view gets destroyed
	 */
	public ngOnDestroy(): void {

		// Unsubscribe from all services (free resources manually)
		this.serviceSubscriptions.forEach( ( subscription: Subscription ) => {
			subscription.unsubscribe();
		} );

	}

	/**
	 * Reset search form
	 */
	private onResetSearch(): void {
		( <Control> this.searchForm.controls[ 'text' ] ) // Cast from AbstractControl
			.updateValue( '' );
	}

	/**
	 * Submit search form, emit search change event containing the search parameters
	 */
	private onSubmitSearch(): void {
		this.changeSearch.emit( {
			text: this.searchForm.value.text.toLowerCase() // Better have lowercase in the URL
		} );
	}

	/**
	 * Select an entry in the user dropdown menu
	 * @param {string} value Value of the dropdown item
	 */
	private onDropdownSelect( value: string ): void {

		switch ( value ) {

			// Logout
			case 'logout':
				this.logout.emit( null );
				break;

			default:
				this.notifierService.notify( 'default', '(BETA) This functionality is not yet available in this beta version.' );
				break;

		}

	}

}
