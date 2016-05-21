/**
 * External imports
 */
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { Store, Action } from '@ngrx/store';
import { List, Map } from 'immutable';

/**
 * Internal imports
 */
import { AppStore, AppService } from './../app';
import { Bookmark } from './bookmark.model';
import {
	LOAD_BOOKMARKS,
	ADD_BOOKMARK,
	UPDATE_BOOKMARK,
	UPDATE_BOOKMARKS_UNASSIGN_LABEL,
	DELETE_BOOKMARK,
	DELETE_FOLDER_BOOKMARKS
} from './bookmark.store';

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
	 * Add a new bookmark
	 * @param {any} data Data
	 */
	public addBookmark( data: any ): void {

		// TODO: API CALL, gets also created?
		let apiCallResultId: number = 30;
		data.id = apiCallResultId;

		// Dispatch action
		this.store.dispatch( {
			payload: {
				data: data,
				id: apiCallResultId
			},
			type: ADD_BOOKMARK
		} );

	}

	/**
	 * Update one value of a bookmark
	 * @param {number}        bookmarkId Bookmark ID
	 * @param {string}        attribute  Attribute
	 * @param {string|number} newValue   New / updated value
	 */
	public updateBookmarkValue( bookmarkId: number, attribute: string, newValue: string|number ): void {
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
	public deleteBookmark( bookmarkId: number ): void {

		// TODO: API CALL

		// Dispatch action
		this.store.dispatch( {
			payload: {
				id: bookmarkId
			},
			type: DELETE_BOOKMARK
		} );

	}

	/**
	 * Delete all bookmarks within provided folder IDs
	 * Sidenote: Used in combination with deleting a folder, no API call here
	 * @param {Array<number>} folderids List of folder IDs
	 */
	public deleteAllBookmarksInFolders( folderIds: Array<number> ): void {

		// Dispatch action
		this.store.dispatch( {
			payload: {
				folderIds: folderIds
			},
			type: DELETE_FOLDER_BOOKMARKS
		} );

	}

	/**
	 * Unassign a label from all bookmarks this label is currently assigned to
	 * Sidenote: Used in combination with deleting a label, no API call here
	 * @param {number} labelId Label ID
	 */
	public unassignLabelFromAllBookmarks( labelId: number ): void {

		// Dispatch action
		this.store.dispatch( {
			payload: {
				labelId: labelId
			},
			type: UPDATE_BOOKMARKS_UNASSIGN_LABEL
		} );

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

	/**
	 * Get bookmark template (for creating a new bookmark)
	 * @return {Bookmark} Bookmark template
	 */
	public getBookmarkTemplate(): Bookmark {
		return <Bookmark> Map<string, any>( {
			description: '',
			labels: List<number>(),
			path: null,
			position: null,
			title: 'Unnamed bookmark',
			url: ''
		} );
	}

}