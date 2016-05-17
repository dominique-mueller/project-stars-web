/**
 * External imports
 */
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

/**
 * Internal imports
 */
import { Folder } from './../../services/folder';
import { IconComponent } from './../icon/icon.component';

/**
 * Shared component: Folder
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
	 * Input: Folder
	 */
	@Input()
	private folder: Folder;

	/**
	 * Output: Select event, emitting folder ID
	 */
	@Output()
	private select: EventEmitter<number>;

	/**
	 * Output: Click on details event
	 */
	@Output()
	private clickOnDetails: EventEmitter<number>;

	/**
	 * Constructor
	 */
	constructor() {

		// Setup
		this.folder = null;
		this.select = new EventEmitter();
		this.clickOnDetails = new EventEmitter();

	}

	/**
	 * Click on folder
	 * @param {number} folderId Id of selected folder
	 */
	private onClickOnFolder( folderId: number ): void {
		this.select.emit( folderId );
	}

	/**
	 * Show folder details panel
	 * @param {number} folderId Id of selected folder
	 */
	private onClickOnDetails( folderId: number ): void {
		this.clickOnDetails.emit( folderId );
	}

}
