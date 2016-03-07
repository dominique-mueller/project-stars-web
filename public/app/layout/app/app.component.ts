/**
 * Imports
 */
import { Component } from 'angular2/core';
import { IconComponent } from '../../shared/icon/icon.component';
import { DropdownComponent, DropdownItemModel } from '../../shared/dropdown/dropdown.component';

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
	private dropdownItems: DropdownItemModel[];

	// Constructor
	constructor() {

		this.dropdownItems = [
			new DropdownItemModel( 'link', 'settings', 'Settings' ),
			new DropdownItemModel( 'link', 'apps', 'Apps' ),
			new DropdownItemModel( 'divider' ),
			new DropdownItemModel( 'link', 'help', 'Help' ),
			new DropdownItemModel( 'link', 'feedback', 'Feedback' ),
			new DropdownItemModel( 'link', 'about', 'About this app' ),
			new DropdownItemModel( 'divider' ),
			new DropdownItemModel( 'link', 'logout', 'Logout' )
		];

	}

	// TODO: Write better event handler
	private log( value: string ): void {
		console.log( value );
	}

}
