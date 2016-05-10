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
import { LOAD_BOOKMARKS, UPDATE_BOOKMARK, DELETE_BOOKMARK } from './bookmark.store';

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
	 * Update one value of a bookmark
	 * @param {number} bookmarkId Bookmark ID
	 * @param {string} attribute  Attribute
	 * @param {string} newValue   New / updated value
	 */
	public updateBookmarkValue( bookmarkId: number, attribute: string, newValue: string ): void {
		let data: any = {};
		data[ attribute ] = newValue;
		this.updateBookmark( bookmarkId, data );
	}

	/**
	 * Assign one new label to a bookmark
	 * @param {number}       bookmarkId    Bookmark ID
	 * @param {List<number>} currentLabels List of currently assigned labels
	 * @param {number}       labelId       ID of the new label
	 */
	public assignLabelToBookmark( bookmarkId: number, currentLabels: List<number>, labelId: number ): void {
		let data: any = {
			labels: currentLabels.push( labelId )
		};
		this.updateBookmark( bookmarkId, data );
	}

	/**
	 * Unassign one label from a bookmark
	 * @param {number}       bookmarkId    Bookmark ID
	 * @param {List<number>} currentLabels List of currently assigned labels
	 * @param {number}       labelId       ID fo the label to be unassigned / removed
	 */
	public unassignLabelFromBookmark( bookmarkId: number, currentLabels: List<number>, labelId: number ): void {
		let data: any = {
			labels: currentLabels.filter( ( currentLabelId: number ) => currentLabelId !== labelId )
		};
		this.updateBookmark( bookmarkId, data );
	}

	/**
	 * Delete one bookmark
	 * @param {number} bookmarkId Bookmark ID
	 */
	public deleteBookmark(bookmarkId: number): void {

		// TODO: API CALL

		// Dispatch action
		this.store.dispatch({
			payload: {
				id: bookmarkId
			},
			type: DELETE_BOOKMARK
		});

	}

	/**
	 * Update bookmark
	 * @param {number} bookmarkId Bookmark ID
	 * @param {any]    data       Data
	 */
	private updateBookmark( bookmarkId: number, data: any ): void {

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
