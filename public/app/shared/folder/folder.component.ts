/**
 * External imports
 */
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

/**
 * Internal imports
 */
import { IconComponent } from './../icon/icon.component';

/**
 * Folde component
 */
@Component( {
	changeDetection: ChangeDetectionStrategy.OnPush,
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
	 * Event emitter for selecting a folder
	 */
	@Output()
	private select: EventEmitter<number>;

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
		this.select = new EventEmitter();
		this.clickOnDetails = new EventEmitter();

	}

	/**
	 * Select folder
	 * @param {number} folderId Id of selected folder
	 */
	private selectFolder( folderId: number ): void {

		// Emit component event
		this.select.emit(folderId);

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
