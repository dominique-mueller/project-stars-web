/**
 * Imports
 */
import { Component, Input, Output, EventEmitter } from 'angular2/core';
import { DropdownItemModel } from './dropdownItem.model';
import { IconComponent } from '../icon/icon.component';

/**
 * Exports
 */
export { DropdownItemModel } from './dropdownItem.model';

/**
 * Dropdown Component
 */
@Component( {
	directives: [ IconComponent ],
	selector: 'app-dropdown',
	templateUrl: './dropdown.component.html'
} )
export class DropdownComponent {

	@Input()
	private items: DropdownItemModel[];

	@Output()
	private select: EventEmitter<any>;

	private isOpen: boolean;

	// Constructor (set default values)
	constructor() {
		this.select = new EventEmitter();
		this.isOpen = false;
	}

	// Emit event when clicking on dropdown list item
	private choose( value: string ): void {
		this.isOpen = false;
		this.select.emit( value );
	}

	// Toggle dropdown list
	private toggle(): void {
		this.isOpen = !this.isOpen;
	}

}
