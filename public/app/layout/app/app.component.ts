/**
 * Imports
 */
import { Component } from 'angular2/core';
import { IconComponent } from '../../shared/icon/icon.component';
import { DropdownComponent, DropdownItem, DropdownLink, DropdownDivider } from '../../shared/dropdown/dropdown.component';

/**
 * App Component
 */
@Component( {
	directives: [ IconComponent, DropdownComponent ],
	selector: 'app',
	templateUrl: './app.component.html'
} )
export class AppComponent {

	// TODO: Put them somewhere else (maybe a service?)
	private app: string = 'Project Stars';
	private name: string = 'Niklas Agethen';
	private dropdownItems: DropdownItem[];

	/**
	 * Constructor
	 */
	constructor() {

		// Set dropdown values
		this.dropdownItems = [
			new DropdownLink(  'settings', 'Settings' ),
			new DropdownLink(  'apps', 'Apps' ),
			new DropdownDivider(),
			new DropdownLink( 'help', 'Help' ),
			new DropdownLink( 'feedback', 'Feedback' ),
			new DropdownLink( 'about', 'About this app' ),
			new DropdownDivider(),
			new DropdownLink( 'logout', 'Logout' )
		];

	}

	// TODO: Write better event handler
	private log( value: string ): void {
		console.log( value );
	}

}
