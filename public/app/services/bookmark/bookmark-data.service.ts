/**
 * External imports
 */
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { Store, Action } from '@ngrx/store';
import { List } from 'immutable';

/**
 * Internal imports
 */
import { AppStore, AppService } from './../app';
import { Bookmark } from './bookmark.model';
import { LOAD_BOOKMARKS, UPDATE_BOOKMARK } from './bookmark.store';

/**
 * Bookmark data service
 * Contains functions for loading, creating, updating or deleting bookmark data (on the server)
 */
@Injectable()
export class BookmarkDataService {

	/**
	 * Observable list of bookmarks
	 */
	public bookmarks: Observable<List<Bookmark>>;

	/**
	 * Status flag representing the current fetching status
	 */
	public isFetching: boolean;

	/**
	 * Http service
	 */
	private http: Http;

	/**
	 * App service
	 */
	private appService: AppService;

	/**
	 * App store
	 */
	private store: Store<AppStore>;

	/**
	 * Constructor
	 */
	constructor( http: Http, appService: AppService, store: Store<AppStore> ) {

		// Initialize services
		this.http = http;
		this.appService = appService;
		this.store = store;

		// Setup
		this.bookmarks = store.select( 'bookmarks' ); // Select returns an observable
		this.isFetching = false;

	}

	/**
	 * Load all bookmarks from the server
	 */
	public loadBookmarks(): void {

		// Fetch data from server
		this.isFetching = true;
		this.http.get( `${ this.appService.API_URL }/bookmarks.mock.json` ) // TODO: Change to REST API

			// Convert data
			.map( ( response: Response ) => <Array<any>> response.json().data )

			// Create action
			.map( ( payload: Array<any> ) => ( { type: LOAD_BOOKMARKS, payload } ) )

			// Dispatch action
			.subscribe(
				( action: Action ) => {
					this.isFetching = false;
					this.store.dispatch( action );
				}
			);

			// TODO: Error handling

	}

	/**
	 * Update bookmark
	 * @param {number} bookmarkId Bookmark ID
	 * @param {any]    data       Data
	 */
	public updateBookmark( bookmarkId: number, data: any ): void {

		// TODO: API CALL

		// Dispatch action
		this.store.dispatch( {
			payload: {
				data: data,
				id: bookmarkId
			},
			type: UPDATE_BOOKMARK
		} );

	}

}
