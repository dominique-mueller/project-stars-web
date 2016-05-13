/**
 * External imports
 */
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

/**
 * Internal imports
 */
import { Label } from './../../services/label';
import { IconComponent } from './../icon/icon.component';

/**
 * Shared component: Assign label
 */
@Component( {
	changeDetection: ChangeDetectionStrategy.OnPush,
	directives: [
		IconComponent
	],
	host: {
		class: 'assign-label'
	},
	selector: 'app-assign-label',
	templateUrl: 'assign-label.component.html'
} )
export class AssignLabelComponent {

	/**
	 * Input: List of labels
	 */
	@Input()
	private labels: Map<number, Label>;

	/**
	 * Output: Select event, emits label ID
	 */
	@Output()
	private select: EventEmitter<number>;

	/**
	 * Internal: Dropdown visibility status
	 */
	private isOpen: boolean;

	/**
	 * Constructor
	 */
	constructor() {

		// Setup
		this.labels = null;
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
	 * Select a label
	 * @param {number} labelId ID of the selected label
	 */
	private onSelectLabel( labelId: number ): void {
		this.select.emit( labelId );
		this.closeDropdown();
	}

}
