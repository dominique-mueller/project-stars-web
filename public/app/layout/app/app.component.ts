/**
 * Imports
 */
import { Component, OnInit, OnDestroy } from 'angular2/core';
import { HTTP_PROVIDERS } from 'angular2/http';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { HeaderComponent } from '../header/header.component';
import { BookmarkService, Bookmark } from '../../services/bookmark/bookmark.service';

/**
 * App Component
 */
@Component( {
	directives: [ HeaderComponent ],
	providers: [ HTTP_PROVIDERS, BookmarkService ],
	selector: 'app',
	templateUrl: './app.component.html'
} )
export class AppComponent implements OnInit, OnDestroy {

	/**
	 * Bookmark service
	 */
	private bookmarkService: BookmarkService;

	/**
	 * Bookmark service scubscription
	 */
	private bookmarkServiceSubscription: Subscription;

	/**
	 * Bookmarks
	 */
	private bookmarks: Bookmark[];

	/**
	 * Constructor
	 * @param {BookmarkService} bookmarkService Bookmark service
	 */
	constructor( bookmarkService: BookmarkService ) {
		this.bookmarkService = bookmarkService;
	}

	/**
	 * Call this when the view gets initialized
	 * TODO: Some kind of spinner thing, maybe better in the service?
	 */
	public ngOnInit(): void {

		// Get all bookmarks by subscribing to the service
		this.bookmarkServiceSubscription = this.bookmarkService
			.getBookmarks()
			.subscribe(
				( bookmarks: Bookmark[] ) => {
					this.bookmarks = bookmarks;
				},
				( error: any ) => {
					alert( 'Opps, something went terribly wrong.' ); // Please some proper error handling
					console.log( error );
				}
			);

	}

	/**
	 * Call this when the view gets destroyed
	 */
	public ngOnDestroy(): void {

		// Unsubscribe from the bookmark service
		this.bookmarkServiceSubscription.unsubscribe();

	}

}
