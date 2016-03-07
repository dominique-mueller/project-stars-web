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

	// Constructor
	constructor() {
		this.select = new EventEmitter();
	}

	// Emit event on click
	private choose( value: string ): void {
		this.select.emit( value );
	}

}
