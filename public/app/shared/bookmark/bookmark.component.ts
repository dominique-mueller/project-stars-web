/**
 * External imports
 */
import { Component, Input, Output, EventEmitter } from 'angular2/core';
import { Map } from 'immutable';

/**
 * Internal imports
 */
import { IconComponent } from './../icon/icon.component';

/**
 * Bookmark component
 */
@Component( {
	directives: [
		IconComponent
	],
	host: {
		class: 'bookmark'
	},
	selector: 'app-bookmark',
	templateUrl: './bookmark.component.html'
} )
export class BookmarkComponent {

	/**
	 * Bookmark data
	 */
	@Input()
	private bookmark: Map<string, any>;

	/**
	 * Event emitter for info button
	 */
	@Output()
	private clickOnDetails: EventEmitter<number>;

	/**
	 * Constructor
	 */
	constructor() {

		// Setup
		this.clickOnDetails = new EventEmitter();

	}

}
