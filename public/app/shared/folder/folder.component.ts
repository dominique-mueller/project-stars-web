/**
 * File: Folder component
 */

import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

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
	private select: EventEmitter<string>;

	/**
	 * Output: Click on details event
	 */
	@Output()
	private clickOnDetails: EventEmitter<string>;

	/**
	 * Constructor
	 */
	constructor() {

		// Setup
		this.folder = null;
		this.select = new EventEmitter<string>();
		this.clickOnDetails = new EventEmitter<string>();

	}

	/**
	 * Click on folder
	 * @param {string} folderId Id of selected folder
	 */
	private onClickOnFolder( folderId: string ): void {
		this.select.emit( folderId );
	}

	/**
	 * Show folder details panel
	 * @param {string} folderId Id of selected folder
	 */
	private onClickOnDetails( folderId: string ): void {
		this.clickOnDetails.emit( folderId );
	}

}
