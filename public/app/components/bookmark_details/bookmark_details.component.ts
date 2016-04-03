/**
 * External imports
 */
import { Component, OnInit, Input, Output, EventEmitter } from 'angular2/core';
import { List, Map } from 'immutable';

/**
 * Internal imports
 */
import { IBookmark } from './../../services/bookmark/bookmark.service';
import { IFolder } from './../../services/folder/folder.service';
import { ILabel } from './../../services/label/label.service';
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
	 * Information about the currently selected element
	 */
	@Input()
	private element: Map<string, any>;

	/**
	 * Data of the currently selected element
	 */
	@Input()
	private data: Map<string, any>;

	/**
	 * Labels
	 */
	@Input()
	private labels: List<Map<string, any>>;

	/**
	 * Close event
	 */
	@Output()
	private close: EventEmitter<any>;

	/**
	 * Editing mode
	 */
	private editMode: boolean;

	constructor() {

		// Setup
		this.close = new EventEmitter();
		this.editMode = false;

	}

	public ngOnInit(): void {
		// TOOD
	}

	private closePanel(): void {
		this.close.emit( null );
	}

}
