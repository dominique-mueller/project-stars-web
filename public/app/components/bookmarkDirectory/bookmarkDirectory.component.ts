/**
 * Imports
 */
import { Component, Input, Output, EventEmitter, OnChanges, SimpleChange } from 'angular2/core';

/**
 * Bookmark directory component (recursive)
 */
@Component( {
	directives: [
		BookmarkDirectoryComponent
	],
	selector: 'app-bookmark-directory',
	templateUrl: 'bookmarkDirectory.component.html'
} )
export class BookmarkDirectoryComponent implements OnChanges {

	/**
	 * Sub directories of the current directory
	 */
	@Input()
	private directories: any[];

	/**
	 * Currently active path
	 */
	@Input()
	private activePath: string[];

	/**
	 * Select event emitter
	 */
	@Output()
	private select: EventEmitter<string>;

	/**
	 * Manipulated active path for component children
	 */
	private childActivePath: string[];

	/**
	 * Active folder in the current layer
	 */
	private activeFolder: string;

	/**
	 * Tells whether the current layer includes the final folder
	 */
	private isFinalFolder: boolean;

	/**
	 * Constructor
	 */
	constructor() {
		this.select = new EventEmitter();
		this.childActivePath = [ '' ];
		this.activeFolder = '';
		this.isFinalFolder = false;
	}

	/**
	 * When the activePath component input changes, update the currently active folder
	 * @param {SimpleChange} changes Changes for 'directories' and 'activePath'
	 */
	public ngOnChanges( changes: {
		[ key: string ]: SimpleChange,
		directories: SimpleChange,
		activePath: SimpleChange
	} ): any {

		// Reset
		this.childActivePath = [''];
		this.activeFolder = '';
		this.isFinalFolder = false;

		// First check that we can access the active path (skipping changes in the beginning)
		if ( changes.hasOwnProperty( 'activePath' ) && typeof changes.activePath.currentValue !== 'undefined' &&
			changes.activePath.currentValue.length > 0 && changes.activePath.currentValue[0] !== '' ) {

			// Set the active folder of this layer
			this.activeFolder = changes.activePath.currentValue[0];

			// Create a flat copy of the rest
			this.childActivePath = changes.activePath.currentValue.slice(1);

			// Check if the current layer includes the final folder
			if (changes.activePath.currentValue.length === 1) {
				this.isFinalFolder = true;
			}

		}

	}

	/**
	 * Handle the click on a folder element
	 * @param {string} folderName Name of the folder
	 */
	private goToFolder( folderName: string ): void {
		this.select.emit( folderName );
	}

	/**
	 * Pipe through events from deeper recursive components
	 * @param {string} selectedPath Selected subfolder
	 * @param {string} currentPath  Current (parent) folder
	 */
	private pipeThrough( selectedPath: string, currentPath: string ): void {
		this.select.emit( `${ currentPath }/${ selectedPath }` );
	}

}
