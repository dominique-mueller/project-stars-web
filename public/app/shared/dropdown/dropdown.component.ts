/**
 * Imports
 */
import { Component, Input, Output, EventEmitter } from 'angular2/core';
import { DropdownItem, DropdownLink, DropdownDivider } from './dropdown.model';
import { IconComponent } from './../icon/icon.component';

/**
 * Exports
 */
export { DropdownItem, DropdownLink, DropdownDivider } from './dropdown.model';

/**
 * Dropdown Component
 */
@Component( {
	directives: [ IconComponent ],
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
	 * Output: Select event
	 */
	@Output()
	private select: EventEmitter<any>;

	/**
	 * Status of the dropdown menu
	 */
	private isOpen: boolean;

	/**
	 * Constructor
	 */
	constructor() {
		this.select = new EventEmitter();
		this.isOpen = false;
	}

	/**
	 * Choose a dropdown item
	 * @param {string} value Dropdown item value
	 */
	private choose( value: string ): void {
		this.isOpen = false;
		this.select.emit( value );
	}

	/**
	 * Toggle dropdown visibility
	 */
	private toggle(): void {
		this.isOpen = !this.isOpen;
	}

}
