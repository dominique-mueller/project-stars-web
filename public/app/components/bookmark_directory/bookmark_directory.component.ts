/**
 * External imports
 */
import { Component, Input, Output, EventEmitter, OnChanges, SimpleChange } from 'angular2/core';

/**
 * Internal imports
 */
import { FolderService, IFolder } from './../../services/folder/folder.service';
import { IconComponent } from './../../shared/icon/icon.component';

/**
 * Bookmark directory component (recursive)
 */
@Component( {
	directives: [
		BookmarkDirectoryComponent,
		IconComponent
	],
	selector: 'app-bookmark-directory',
	templateUrl: 'bookmark_directory.component.html'
} )
export class BookmarkDirectoryComponent implements OnChanges {

	/**
	 * Subfolders of the current directory
	 */
	@Input()
	private folders: IFolder[];

	/**
	 * Folder id of the parent folder
	 */
	@Input()
	private parentFolderId: number;

	/**
	 * Folder id of the currently active folder
	 */
	@Input()
	private activeFolderId: number;

	/**
	 * Select event emitter
	 */
	@Output()
	private select: EventEmitter<number>;

	/**
	 * Folder service
	 */
	private folderService: FolderService;

	/**
	 * Folders for the current subfolder we're in
	 */
	private subfolders: IFolder[];

	/**
	 * Constructor - TODO: Docs
	 */
	constructor( folderService: FolderService ) {

		// Initialize services
		this.folderService = folderService;

		// Setup
		this.subfolders = [];
		this.select = new EventEmitter();

	}

	/**
	 * When the activePath component input changes
	 */
	public ngOnChanges( changes: {
		[ key: string ]: SimpleChange,
		folders: SimpleChange
	} ): void {

		// Get subfolders of this folder (filter)
		if ( changes.hasOwnProperty( 'folders' ) && changes.folders.currentValue.length > 0 ) {
			this.subfolders = this.folderService.getFoldersByFolderId( changes.folders.currentValue, this.parentFolderId );
		}

	}

	/**
	 * Handle click on a folder element
	 * @param {number} folderId Id of the requested folder
	 */
	private goToFolder( folderId: number ): void {

		// Only emit the event if the selected folder is not the currently active one
		if ( folderId !== this.activeFolderId ) {
			this.select.emit( folderId );
		}

	}

}
