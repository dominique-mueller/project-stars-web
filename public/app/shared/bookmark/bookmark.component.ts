/**
 * External imports
 */
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { Map } from 'immutable';

/**
 * Internal imports
 */
import { FormatUrlPipe } from './../../pipes/format_url.pipe';
import { LabelComponent } from './../label/label.component';
import { IconComponent } from './../icon/icon.component';

/**
 * Bookmark component
 */
@Component( {
	changeDetection: ChangeDetectionStrategy.OnPush,
	directives: [
		LabelComponent,
		IconComponent
	],
	host: {
		class: 'bookmark'
	},
	pipes: [
		FormatUrlPipe
	],
	selector: 'app-bookmark',
	templateUrl: './bookmark.component.html'
} )
export class BookmarkComponent {

	/**
	 * Bookmark
	 */
	@Input()
	private bookmark: Map<string, any>;

	/**
	 * All labels
	 */
	@Input()
	private labels: Map<string, Map<string, any>>;

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

	/**
	 * Show bookmark details
	 * @param {number} bookmarkId Id of selected bookmark
	 */
	private showDetails( bookmarkId: number ): void {

		// Emit component event
		this.clickOnDetails.emit( bookmarkId );

	}

}
