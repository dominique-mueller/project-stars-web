/**
 * External imports
 */
import { Component, OnInit, Input, Output, EventEmitter } from 'angular2/core';

/**
 * Internal imports
 */
import { IBookmark } from './../../services/bookmark/bookmark.service';
import { IFolder } from './../../services/folder/folder.service';
import { IconComponent } from './../../shared/icon/icon.component';

/**
 * Bookmark details component
 */
@Component( {
	directives: [
		IconComponent
	],
	selector: 'app-bookmark-details',
	templateUrl: './bookmark_details.component.html'
} )
export class BookmarkDetailsComponent implements OnInit {

	/**
	 * Visibility flag
	 */
	@Input()
	private visible: boolean;

	/**
	 * Currently selected element
	 */
	@Input()
	private element: IBookmark | IFolder;

	/**
	 * Type of the currently selected element
	 */
	@Input()
	private type: string;

	/**
	 * Close event
	 */
	@Output()
	private close: EventEmitter<any>;

	constructor() {

		// Setup
		this.close = new EventEmitter();

	}

	public ngOnInit(): void {
		// TOOD
	}

	private closePanel(): void {
		this.close.emit( null );
	}

}
