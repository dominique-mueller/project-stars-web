/**
 * External imports
 */
import { Component, Input, Output, EventEmitter, OnChanges, SimpleChange,
	ChangeDetectionStrategy } from '@angular/core';
import { List } from 'immutable';

/**
 * Internal imports
 */
import { Folder, FolderLogicService } from './../../services/folder';
import { IconComponent } from './../../shared/icon/icon.component';

/**
 * View component (dumb, recursive): Bookmark directory
 */
@Component( {
	changeDetection: ChangeDetectionStrategy.OnPush,
	directives: [
		BookmarkDirectoryComponent,
		IconComponent
	],
	host: {
		class: 'directory'
	},
	selector: 'app-bookmark-directory',
	templateUrl: 'bookmark-directory.component.html'
} )
export class BookmarkDirectoryComponent implements OnChanges {

	/**
	 * Input: List of all folders (just piped through the whole directory hierarchy, from top to bottom)
	 */
	@Input()
	private folders: List<Folder>;

	/**
	 * Input: ID of the parent folder
	 */
	@Input()
	private parentFolderId: number;

	/**
	 * Input: ID of the currently opened folder
	 */
	@Input()
	private openedFolderId: number;

	/**
	 * Output: Select event, emits folder ID
	 */
	@Output()
	private selectFolder: EventEmitter<number>;

	/**
	 * Internal: Folder logic service
	 */
	private folderLogicService: FolderLogicService;

	/**
	 * Internal: List of subfolders living inside this (the current) directory layer
	 */
	private subfolders: List<Folder>;

	/**
	 * Constructor
	 */
	constructor( folderLogicService: FolderLogicService ) {

		// Initialize
		this.folderLogicService = folderLogicService;

		// Setup
		this.folders = List<Folder>();
		this.parentFolderId = null;
		this.openedFolderId = null;
		this.selectFolder = new EventEmitter();
		this.subfolders = List<Folder>();

	}

	/**
	 * Watch for input value updates
	 */
	public ngOnChanges( changes: {
		[ key: string ]: SimpleChange,
		folders: SimpleChange
	} ): void {

		// Get / update the subfolders of this (the current) directory layer
		// But only do this when the folders actually exist and changed
		if ( changes.hasOwnProperty( 'folders' )
			&& typeof changes.folders.currentValue !== 'undefined'
			&& changes.folders.currentValue.size > 0 ) {
			this.subfolders = this.folderLogicService
				.getSubfoldersByFolderId( changes.folders.currentValue, this.parentFolderId );
		}

	}

	/**
	 * Handle click on a folder element (but only when the selected folder is not already the currently opened one)
	 * We simply pipe the event through to the top until we reach the bookmarks component which then handles the navigation
	 * @param {number} folderId ID of the folder we want to navigate to
	 */
	private onSelectFolder(folderId: number): void {
		if ( folderId !== this.openedFolderId ) {
			this.selectFolder.emit(folderId);
		}
	}

}
