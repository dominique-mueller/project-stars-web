/**
 * External imports
 */
import { Component, Input, Output, EventEmitter } from 'angular2/core';

/**
 * Internal imports
 */
import { IconComponent } from './../icon/icon.component';

/**
 * Folde component
 */
@Component( {
	directives: [
		IconComponent
	],
	host: {
		class: 'folder'
	},
	selector: 'app-folder',
	templateUrl: './folder.component.html'
} )
export class FolderComponent {

	/**
	 * Folder
	 */
	@Input()
	private folder: Map<string, any>;

	/**
	 * Event emitter for info button
	 */
	@Output()
	private clickOnDetails: EventEmitter<number>;

	/**
	 * Constructor
	 */
	constructor() {

		// Setup
		this.clickOnDetails = new EventEmitter();

	}

	/**
	 * Show folder details
	 * @param {number} folderId Id of selected folder
	 */
	private showDetails( folderId: number ): void {

		// Emit component event
		this.clickOnDetails.emit( folderId );

	}

}
