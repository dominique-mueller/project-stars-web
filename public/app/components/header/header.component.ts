/**
 * External imports
 */
import { Component } from 'angular2/core';

/**
 * Internal imports
 */
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
	 * Search input data
	 */
	private search: string;

	// TODO: Put them somewhere else (maybe a service or a config?)
	private app: string = 'Project Stars';
	private name: string = 'Niklas Agethen';

	/**
	 * List of dropdown items
	 */
	private dropdownItems: DropdownItem[];

	/**
	 * Constructor
	 */
	constructor() {

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

}
