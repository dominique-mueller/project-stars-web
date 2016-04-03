/**
 * External imports
 */
import { Component, Input, Output, EventEmitter,
	OnChanges, SimpleChange, ChangeDetectionStrategy } from 'angular2/core';
import { List, Map } from 'immutable';

/**
 * Internal imports
 */
import { FolderService } from './../../services/folder/folder.service';
import { IconComponent } from './../../shared/icon/icon.component';

/**
 * Bookmark directory component (recursive)
 */
@Component( {
	changeDetection: ChangeDetectionStrategy.OnPush,
	directives: [
		BookmarkDirectoryComponent,
		IconComponent
	],
	selector: 'app-bookmark-directory',
	templateUrl: 'bookmark_directory.component.html'
} )
export class BookmarkDirectoryComponent implements OnChanges {

	/**
	 * All folders (just piped through the whole directory, from top to bottom)
	 */
	@Input()
	private folders: List<Map<string, any>>;

	/**
	 * Parent folder
	 */
	@Input()
	private parentFolder: number;

	/**
	 * Currently opened folder
	 */
	@Input()
	private openedFolder: number;

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
	 * Subfolders of this directory layer
	 */
	private subfolders: List<Map<string, any>>;

	/**
	 * Constructor
	 * @param {FolderService} folderService Folder service
	 */
	constructor( folderService: FolderService ) {

		// Initialize services
		this.folderService = folderService;

		// Setup
		this.subfolders = List<Map<string, any>>();
		this.select = new EventEmitter();

	}

	/**
	 * Watch for input value updates
	 */
	public ngOnChanges( changes: {
		[ key: string ]: SimpleChange,
		folders: SimpleChange
	} ): void {

		// Get subfolders of this directory layer (of folders did actually change)
		if ( changes.hasOwnProperty( 'folders' ) && changes.folders.currentValue.length > 0 ) {
			this.subfolders = this.folderService.getSubfolders( changes.folders.currentValue, this.parentFolder );
		}

	}

	/**
	 * Handle click on a folder element
	 * @param {number} folder Requested folder
	 */
	private goToFolder( folder: number ): void {

		// Only emit the event if the selected folder is not the currently active one
		if ( folder !== this.openedFolder ) {
			this.select.emit( folder );
		}

	}

}
