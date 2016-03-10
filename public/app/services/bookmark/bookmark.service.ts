/**
 * Imports
 */
import { Injectable } from 'angular2/core';
import { Http, Response } from 'angular2/http';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/share';
import 'rxjs/add/observable/throw';
import { Bookmark } from './bookmark.model';

/**
 * Exports
 */
export { Bookmark } from './bookmark.model';

/**
 * Bookmark service
 */
@Injectable()
export class BookmarkService {

	/**
	 * Http service
	 */
	public http: Http;

	/**
	 * Bookmarks
	 */
	public bookmarks: Observable<Bookmark[]>;

	/**
	 * Bookmark observer
	 */
	private bookmarkObserver: Observer<Bookmark[]>;

	/**
	 * Bookmark data store
	 */
	private bookmarkStore: {
		bookmarks: Bookmark[]
	};

	/**
	 * Constructor
	 * @param {Http} http Http service
	 */
	constructor( http: Http ) {

		// Initialize http service
		this.http = http;

		// Create the bookmark observable
		this.bookmarks = new Observable( ( observer: Observer<Bookmark[]> ) => {
			this.bookmarkObserver = observer;
		} ).share();

		// Setup bookmark store
		this.bookmarkStore = {
			bookmarks: []
		};

	}

	/**
	 * Get all bookmarks
	 */
	public getBookmarks(): void {

		this.http

			// Get data from API
			// TODO: Switch that to the REST API route, get base from some config service
			.get( 'bookmark.temp.json' )

			// Convert data
			.map( ( response: Response ) => <Bookmark[]> response.json().data )

			// Subscription
			.subscribe(
				( data: Bookmark[] ) => {

					// Update bookmark store
					this.bookmarkStore.bookmarks = data;

					// Push to observable stream
					this.bookmarkObserver.next( this.bookmarkStore.bookmarks );

				},
				( error: any ) => {
					alert( 'Opps, something went terribly wrong.' ); // Please some proper error handling
					console.log( error );
				}

			);

	}

}
