/**
 * File: Assign label component
 */

import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { Map } from 'immutable';

import { Label } from './../../services/label';
import { ClickOutsideDirective } from './../click-outside/click-outside.directive';
import { IconComponent } from './../icon/icon.component';

/**
 * Shared component: Assign label
 */
@Component( {
	changeDetection: ChangeDetectionStrategy.OnPush,
	directives: [
		ClickOutsideDirective,
		IconComponent
	],
	host: {
		class: 'assign-label scrollbar-small',
		'(keyup.esc)': 'closeDropdown()'
	},
	selector: 'app-assign-label',
	templateUrl: './assign-label.component.html'
} )
export class AssignLabelComponent {

	/**
	 * Input: List of all labels
	 */
	@Input()
	private labels: Map<string, Label>;

	/**
	 * Output: Select event, emits label ID
	 */
	@Output()
	private select: EventEmitter<string>;

	/**
	 * Internal: Dropdown visibility status flag
	 */
	private isOpen: boolean;

	/**
	 * Constructor
	 */
	constructor() {

		// Setup
		this.labels = Map<string, Label>();
		this.select = new EventEmitter<string>();
		this.isOpen = false;

	}

	/**
	 * Open dropdown menu
	 */
	private openDropdown(): void {
		this.isOpen = true;
	}

	/**
	 * Close dropdown menu
	 */
	private closeDropdown(): void {
		this.isOpen = false;
	}

	/**
	 * Close dropdown menu bridge (when clicking outside)
	 * @param {any}         $event      Event (probably mouse event)
	 * @param {HTMLElement} triggerElem Trigger HTML element
	 */
	private closeDropdownOnBlur( $event: any, triggerElem: HTMLElement ): void {
		if ( $event.path.indexOf( triggerElem ) === -1 ) {
			this.closeDropdown();
		}
	}

	/**
	 * When selecting a label, emit the select event and close the dropdown
	 * @param {string} labelId ID of the selected label
	 */
	private onSelectLabel( labelId: string ): void {
		this.select.emit( labelId );
		this.closeDropdown();
	}

}
