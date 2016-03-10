/**
 * Imports
 */
import { Component, Input } from 'angular2/core';

@Component( {
	directives: [BookmarkListComponent],
	selector: 'app-bookmark-list',
	templateUrl: './bookmarkList.component.html'
} )
export class BookmarkListComponent {

	@Input()
	private name: string;

	@Input()
	private bookmarks: any[];

	@Input()
	private folders: any[];

}
