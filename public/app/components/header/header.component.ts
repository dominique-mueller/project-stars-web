/**
 * External imports
 */
import { Component, Output, EventEmitter } from 'angular2/core';

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
export class HeaderComponent {

	/**
	 * Search update event
	 */
	@Output()
	private searchUpdate: EventEmitter<{}>;

	/**
	 * App service
	 */
	private appService: AppService;

	/**
	 * Search input data
	 */
	private search: string;

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
	constructor( appService: AppService ) {

		// Initialize services
		this.appService = appService;

		// Set app name
		this.app = appService.APP_NAME;

		// Initialize event emitter
		this.searchUpdate = new EventEmitter();

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
	 * Dropdown event handler
	 * @param {string} value Value of the dropdown item
	 */
	private log( value: string ): void {
		console.log( value ); // TODO
	}

	/**
	 * Clear search input field
	 */
	private clear(): void {
		this.search = '';
	}

	/**
	 * Submit search update
	 * @param {string} value Search value
	 */
	private submitSearch( value: string ): void {

		console.log('### SEARCH START ...');

		// Emit search update event
		this.searchUpdate.emit( {
			value: value.toLowerCase()
		} );

	}

}
