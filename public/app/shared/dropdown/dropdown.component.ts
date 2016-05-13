/**
 * External imports
 */
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

/**
 * Internal imports
 */
import { DropdownItem, DropdownLink, DropdownDivider } from './dropdown.model';
import { IconComponent } from './../icon/icon.component';

/**
 * Exports
 */
export { DropdownItem, DropdownLink, DropdownDivider } from './dropdown.model';

/**
 * Shared component: Dropdown
 */
@Component( {
	changeDetection: ChangeDetectionStrategy.OnPush,
	directives: [
		IconComponent
	],
	host: {
		class: 'dropdown'
	},
	selector: 'app-dropdown',
	templateUrl: './dropdown.component.html'
} )
export class DropdownComponent {

	/**
	 * Input: List of dropdown items
	 */
	@Input()
	private items: DropdownItem[];

	/**
	 * Output: Select event, emits item value
	 */
	@Output()
	private select: EventEmitter<any>;

	/**
	 * Intenral: Dropdown visibility status
	 */
	private isOpen: boolean;

	/**
	 * Constructor
	 */
	constructor() {

		// Setup
		this.items = [];
		this.select = new EventEmitter();
		this.isOpen = false;

	}

	/**
	 * Select a dropdown item
	 * @param {string} value Value of the selected dropdown item
	 */
	private onSelect( value: string ): void {
		this.select.emit( value );
		this.closeDropdown();
	}

	/**
	 * Toggle dropdown menu
	 */
	private toggleDropdown(): void {
		this.isOpen = !this.isOpen;
	}

	/**
	 * Close dropdown menu
	 */
	private closeDropdown(): void {
		this.isOpen = false;
	}

}
