/**
 * External imports
 */
import { Component, Output, EventEmitter, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { FORM_DIRECTIVES, FormBuilder, ControlGroup, Control } from '@angular/common';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/debounceTime';
import { Map } from 'immutable';

/**
 * Internal imports
 */
import { AppService } from './../../services/app';
import { UiService } from './../../services/ui';
import { IconComponent } from './../../shared/icon/icon.component';
import { DropdownComponent, DropdownItem, DropdownLink, DropdownDivider }
	from './../../shared/dropdown/dropdown.component';

/**
 * View component (smart): Header
 */
@Component( {
	changeDetection: ChangeDetectionStrategy.OnPush,
	directives: [
		FORM_DIRECTIVES,
		IconComponent,
		DropdownComponent
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
	 * App service
	 */
	private appService: AppService;

	/**
	 * UI service
	 */
	private uiService: UiService;

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
	private app: string;

	/**
	 * Flag for temporarily disabling the change search event emitting
	 */
	private isChangeSearchDisabled: boolean;

	/**
	 * List of dropdown items
	 */
	private dropdownItems: DropdownItem[];

	// TODO: Put them into user service
	private name: string = 'Niklas Agethen';

	/**
	 * Constructor
	 */
	constructor(
		appService: AppService,
		uiService: UiService,
		formBuilder: FormBuilder ) {

		// Initialize
		this.appService = appService;
		this.uiService = uiService;

		// Setup
		this.changeSearch = new EventEmitter();
		this.isChangeSearchDisabled = false;
		this.app = appService.APP_NAME;
		this.searchForm = formBuilder.group( {
			text: ''
		} );

		// Setup dropdown values - TODO: Maybe extract to somewhere? App service?
		// TODO: Map / List
		this.dropdownItems = [
			new DropdownLink( 'settings', 'Settings' ),
			new DropdownLink( 'apps', 'Apps' ),
			new DropdownDivider(),
			new DropdownLink( 'help', 'Help' ),
			new DropdownLink( 'feedback', 'Feedback' ),
			new DropdownLink( 'about', 'About this app' ),
			new DropdownDivider(),
			new DropdownLink( 'logout', 'Logout' )
		];

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

		// Save subscriptions
		this.serviceSubscriptions = [
			searchFormSubscription,
			uiServiceSubscription
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
	 * Dropdown event handler
	 * @param {string} value Value of the dropdown item
	 */
	private log( value: string ): void {
		console.log( value ); // TODO: Redirect to route and stuff
	}

}
