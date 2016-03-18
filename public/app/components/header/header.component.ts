/**
 * External imports
 */
import { Component, Output, EventEmitter, OnInit } from 'angular2/core';
import { Control, ControlGroup, FormBuilder } from 'angular2/common';
import 'rxjs/add/operator/debounceTime';

/**
 * Internal imports
 */
import { AppService } from '../../services/app/app.service';
import { IconComponent } from '../../shared/icon/icon.component';
import { DropdownComponent, DropdownItem, DropdownLink, DropdownDivider }
	from '../../shared/dropdown/dropdown.component';

/**
 * Header Component
 */
@Component( {
	directives: [
		IconComponent,
		DropdownComponent
	],
	selector: 'app-header',
	templateUrl: './header.component.html'
} )
export class HeaderComponent implements OnInit {

	/**
	 * Search update event
	 */
	@Output()
	private searchUpdate: EventEmitter<{}>;

	/**
	 * Search form model
	 */
	private searchForm: ControlGroup;

	/**
	 * App service
	 */
	private appService: AppService;

	/**
	 * App name
	 */
	private app: string;

	// TODO: Put them somewhere else (maybe a service or a config?)
	private name: string = 'Niklas Agethen';

	/**
	 * List of dropdown items
	 */
	private dropdownItems: DropdownItem[];

	/**
	 * Constructor
	 */
	constructor( appService: AppService, formBuilder: FormBuilder ) {

		// Initialize services
		this.appService = appService;

		// Set app name
		this.app = appService.APP_NAME;

		// Initialize event emitter
		this.searchUpdate = new EventEmitter();

		// Create search form
		this.searchForm = formBuilder.group( {
			'search': ''
		} );

		// Set dropdown values
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

		// Subscribe to search form value updates
		this.searchForm.valueChanges
			.debounceTime( 250 ) // Debounce in ms
			.subscribe(
				( data: any ) => {
					this.submitSearch();
				},
				( error: any ) => {
					console.log( 'Angular 2 form error.' ); // TODO
				}
			);

	}

	/**
	 * Dropdown event handler
	 * @param {string} value Value of the dropdown item
	 */
	private log( value: string ): void {
		console.log( value ); // TODO
	}

	/**
	 * Reset search form (currently search input only)
	 */
	private reset(): void {
		let searchInput: any = <Control> this.searchForm.find( 'search' ); // Cast from AbstractControl
		searchInput.updateValue('');
	}

	/**
	 * Submit search form, emit update
	 */
	private submitSearch(): void {
		this.searchUpdate.emit( {
			value: this.searchForm.value.search.toLowerCase()
		} );
	}

}
