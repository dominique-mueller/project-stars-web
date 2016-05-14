/**
 * External imports
 */
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

/**
 * Internal imports
 */
import { DropdownItem, DropdownLink, DropdownDivider } from './dropdown.model';
import { IconComponent } from './../icon/icon.component';
import { ClickOutsideDirective } from './../click-outside/click-outside.directive';

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
		IconComponent,
		ClickOutsideDirective
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

	/**
	 * Close dropdown when blurring the dropdown
	 * @param {any}         $event  Event (probably mouse event)
	 * @param {HTMLElement} trigger Trigger HTML element
	 */
	private closeDropdownOnBlur( $event: any, trigger: HTMLElement ): void {

		// Only close the dropdown when the outside-click event wasn't triggered by the trigger element
		if ( $event.path.indexOf( trigger ) === -1 ) {
			this.closeDropdown();
		}

	}

	/**
	 * Select a dropdown item
	 * @param {string} value Value of the selected dropdown item
	 */
	private onSelect(value: string): void {
		this.select.emit(value);
		this.closeDropdown();
	}

}
