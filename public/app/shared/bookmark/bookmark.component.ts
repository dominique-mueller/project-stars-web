/**
 * External imports
 */
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { Map } from 'immutable';

/**
 * Internal imports
 */
import { Bookmark } from './../../services/bookmark';
import { Label } from './../../services/label';
import { FormatUrlPipe } from './../../pipes/format-url.pipe';
import { LabelSimpleComponent } from './../label-simple/label-simple.component';
import { IconComponent } from './../icon/icon.component';

/**
 * Share component: Bookmark
 */
@Component( {
	changeDetection: ChangeDetectionStrategy.OnPush,
	directives: [
		LabelSimpleComponent,
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
	 * Input: Bookmark
	 */
	@Input()
	private bookmark: Bookmark;

	/**
	 * Input: Map of all labels
	 */
	@Input()
	private labels: Map<string, Label>;

	/**
	 * Output: Click on details event, emits the bookmark ID
	 */
	@Output()
	private clickOnDetails: EventEmitter<string>;

	/**
	 * Constructor
	 */
	constructor() {

		// Setup
		this.bookmark = <Bookmark> Map<string, any>();
		this.labels = Map<string, Label>();
		this.clickOnDetails = new EventEmitter<string>();

	}

	/**
	 * Show bookmark details panel
	 * @param {string} bookmarkId Id of the selected bookmark
	 */
	private onClickDetails( bookmarkId: string ): void {
		this.clickOnDetails.emit( bookmarkId );
	}

}
