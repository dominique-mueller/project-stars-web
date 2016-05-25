/**
 * External imports
 */
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { List, Map } from 'immutable';

/**
 * Internal imports
 */
import { Folder, FolderLogicService } from './../../services/folder';
import { IconComponent } from './../icon/icon.component';
import { ClickOutsideDirective } from './../click-outside/click-outside.directive';

/**
 * Shared component: Move into folder
 */
@Component( {
	changeDetection: ChangeDetectionStrategy.OnPush,
	directives: [
		IconComponent,
		ClickOutsideDirective
	],
	host: {
		class: 'move-into-folder scrollbar-small'
	},
	selector: 'app-move-into-folder',
	templateUrl: './move-into-folder.component.html'
} )
export class MoveIntoFolderComponent {

	/**
	 * Input: Element type, e.g. 'bookmark' or 'folder'
	 */
	@Input()
	private elementType: string;

	/**
	 * Input Element ID
	 */
	@Input()
	private elementId: string;

	/**
	 * Input: ID of the current folder
	 */
	@Input()
	private currentPathId: string;

	/**
	 * Input: List of all folders
	 */
	@Input()
	private folders: List<Folder>;

	/**
	 * Output: Select event, emits new folder ID
	 */
	@Output()
	private select: EventEmitter<string>;

	/**
	 * Change detector
	 */
	private changeDetector: ChangeDetectorRef;

	/**
	 * Internal: Folder logic service
	 */
	private folderLogicService: FolderLogicService;

	/**
	 * Currently visible folder
	 */
	private visibleFolder: Folder;

	/**
	 * Next visible folder
	 */
	private nextVisibleFolder: Folder;

	/**
	 * List of visible subfolders contained in the currently visible folder
	 */
	private visibleSubfolders: List<Folder>;

	/**
	 * LList of next visible subfolders contained in the next visible folder
	 */
	private nextVisibleSubfolders: List<Folder>;

	/**
	 * Internal: Dropdown visibility status
	 */
	private isOpen: boolean;

	/**
	 * Internal: Folder navigating status
	 */
	private isNavigating: string;

	/**
	 * Constructor
	 */
	constructor(
		changeDetector: ChangeDetectorRef,
		folderLogicService: FolderLogicService
	) {

		// Initialize
		this.changeDetector = changeDetector;
		this.folderLogicService = folderLogicService;

		// Setup
		this.elementType = 'element';
		this.elementId = null;
		this.currentPathId = null;
		this.folders = List<Folder>();
		this.select = new EventEmitter();
		this.visibleFolder = <Folder> Map<string, any>();
		this.nextVisibleFolder = <Folder> Map<string, any>();
		this.visibleSubfolders = List<Folder>();
		this.nextVisibleSubfolders = List<Folder>();
		this.isOpen = false;
		this.isNavigating = '';

	}

	/**
	 * Open dropdown menu
	 */
	private openDropdown(): void {
		this.initializeFolder();
		this.isOpen = true;
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
	 * Confirm the movement
	 */
	private onClickOnMove(): void {

		// Only emit event when the folder ID actually changed
		if ( this.visibleFolder.get( 'id' ) !== this.currentPathId ) {
			this.select.emit( this.visibleFolder.get( 'id' ) );
		}
		this.closeDropdown(); // Close anyway

	}

	/**
	 * Initialize folder content
	 */
	private initializeFolder(): void {

		// Get current folder and all its subfolders
		this.visibleFolder = this.folderLogicService.getFolderByFolderId( this.folders, this.currentPathId );
		this.visibleSubfolders = this.folderLogicService.getSubfoldersByFolderId( this.folders, this.currentPathId );

	}

	/**
	 * Switch to another folder
	 * @param {string} folder    Folder object (because we do need the isRoot as well, not only the ID)
	 * @param {string} direction Navigation direction, 'up' or 'down'
	 */
	private onSwitchToFolder( folder: Folder, direction: string ): void {

		// Skip if we're already in the root folder
		if ( folder.get( 'isRoot' ) ) {
			return;
		}

		// Get new current folder and all its subfolders
		let folderId: string = direction === 'up' ? folder.get( 'path' ) : folder.get( 'id' );
		this.nextVisibleFolder = this.folderLogicService.getFolderByFolderId( this.folders, folderId );
		this.nextVisibleSubfolders = this.folderLogicService.getSubfoldersByFolderId( this.folders, folderId );

		// Wait for the animation to be done, then silently switch data back to the original view
		this.isNavigating = direction;
		setTimeout(
			() => {
				this.visibleFolder = this.nextVisibleFolder;
				this.visibleSubfolders = this.nextVisibleSubfolders;
				this.isNavigating = '';
				this.changeDetector.markForCheck(); // Trigger change detection
			},
			275
		);

	}

}
