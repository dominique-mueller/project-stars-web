/**
 * Imports
 */
import { Component, Input, Output, EventEmitter } from 'angular2/core';

/**
 * Bookmark directory component (recursive)
 */
@Component( {
	directives: [ BookmarkDirectoryComponent ],
	selector: 'app-bookmark-directory',
	templateUrl: 'bookmarkDirectory.component.html'
} )
export class BookmarkDirectoryComponent {

	/**
	 * Sub directories of the current directory
	 */
	@Input()
	private directories: any[];

	/**
	 * Current path
	 */
	@Input()
	private currentPath: string;

	/**
	 * Select event emitter
	 */
	@Output()
	private select: EventEmitter<string>;

	/**
	 * Constructor
	 */
	constructor() {
		this.select = new EventEmitter();
	}

	private navigate( selectedPath: string ): void {
		this.select.emit( selectedPath );
	}

	private pipeThrough( selectedPath: string ): void {
		this.select.emit( selectedPath );
	}

}
