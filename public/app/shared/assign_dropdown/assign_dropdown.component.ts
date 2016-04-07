/**
 * External imports
 */
import { Component, Input, Output, EventEmitter } from 'angular2/core';

/**
 * Assign label dropdown
 */
@Component( {
	selector: 'app-assign-dropdown',
	templateUrl: 'assign_dropdown.component.html'
} )
export class AssignDropdown {

	/**
	 * List of all items to choose from
	 */
	@Input()
	private items: any;

	/**
	 * Enable search flag
	 */
	@Input()
	private enableSearch: boolean;

	/**
	 * Enable dynamic creation flag
	 */
	@Input()
	private enableDynamicCreation: boolean;

	/**
	 * Select event
	 */
	@Output()
	private select: EventEmitter<any>;

	/**
	 * Create event
	 */
	@Output()
	private create: EventEmitter<any>;

	private filteredItems: any;

	/**
	 * Constructor
	 */
	constructor() {

		// Setup
		this.select = new EventEmitter();
		this.create = new EventEmitter();

		// Set default values
		this.enableSearch = true;
		this.enableDynamicCreation = false;

	}

	private selectItem( item: number ): void {

		console.log('### SELECTED ITEM ' + item);
		this.select.emit( item );

	}

}
