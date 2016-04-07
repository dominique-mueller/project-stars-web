/**
 * External imports
 */
import { Component, Input, Output, EventEmitter } from 'angular2/core';

/**
 * Assign label dropdown
 */
@Component( {
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
	private labels: Map<string, Map<string, any>>;

	/**
	 * Enable search flag
	 */
	@Input()
	private enableSearch: boolean;

	/**
	 * Select event
	 */
	@Output()
	private select: EventEmitter<number>;

	/**
	 * Dropdown status flag
	 * @type {boolean}
	 */
	private isOpen: boolean;

	/**
	 * Constructor
	 */
	constructor() {

		// Setup
		this.select = new EventEmitter();
		this.enableSearch = true;
		this.isOpen = false;

	}

	/**
	 * Select a label
	 * @param {number} labelId If of the selected label
	 */
	private selectLabel( labelId: number ): void {

		// Emit select event
		this.select.emit( labelId );

		// Close dropdown
		this.isOpen = false;

	}

}
