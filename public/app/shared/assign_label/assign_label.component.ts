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
 * Assign label dropdown
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
	templateUrl: 'assign_label.component.html'
} )
export class AssignLabelComponent {

	/**
	 * List of labels to choose from
	 */
	@Input()
	private labels: Map<string, Label>;

	/**
	 * Select event
	 */
	@Output()
	private select: EventEmitter<number>;

	/**
	 * Dropdown status flag
	 */
	private isOpen: boolean;

	/**
	 * Constructor
	 */
	constructor() {

		// Setup
		this.select = new EventEmitter();
		this.isOpen = false;

	}

	/**
	 * Toggle dropdown menu
	 * TODO: Animations
	 */
	private toggleDropdown(): void {
		this.isOpen = !this.isOpen;
	}

	/**
	 * Close dropdown menu
	 * TODO: Animations
	 */
	private closeDropdown(): void {
		this.isOpen = false;
	}

	/**
	 * Select a label
	 * @param {number} labelId Selected label ID
	 */
	private selectLabel( labelId: number ): void {
		this.select.emit( labelId );
		this.closeDropdown();
	}

}
