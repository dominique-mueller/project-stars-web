/**
 * External imports
 */
import { Component, OnInit, Input, Output, EventEmitter } from 'angular2/core';

/**
 * Internal imports
 */
import { IBookmark } from './../../services/bookmark/bookmark.service';
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
	 * Current bookmark
	 */
	@Input()
	private bookmark: IBookmark;

	/**
	 * Close event
	 */
	@Output()
	private close: EventEmitter<IBookmark>;

	constructor() {

		// Setup
		this.close = new EventEmitter();

	}

	public ngOnInit(): void {
		// TOOD
	}

	private exit(): void {
		this.close.emit( this );
	}

}
