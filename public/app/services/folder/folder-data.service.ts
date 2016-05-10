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
import { BookmarkDataService } from './../bookmark';
import { AppStore, AppService } from './../app';
import { Folder } from './folder.model';
import { LOAD_FOLDERS, UPDATE_FOLDER, DELETE_FOLDER } from './folder.store';

/**
 * Folder data service
 * Contains functions for loading, creating, updating or deleting folder data (on the server)
 */
@Injectable()
export class FolderDataService {

	/**
	 * Observable list of folders
	 */
	public folders: Observable<List<Folder>>;

	/**
	 * Status flag representing the current fetching status
	 */
	public isFetching: boolean;

	/**
	 * Http service
	 */
	private http: Http;

	/**
	 * App Service
	 */
	private appService: AppService;

	/**
	 * Bookmark data service
	 */
	private bookmarkDataService: BookmarkDataService;

	/**
	 * App store
	 */
	private store: Store<AppStore>;

	/**
	 * Constructor
	 */
	constructor( http: Http, appService: AppService, bookmarkDataService: BookmarkDataService, store: Store<AppStore> ) {

		// Initialize services
		this.http = http;
		this.appService = appService;
		this.bookmarkDataService = bookmarkDataService;
		this.store = store;

		// Setup
		this.folders = store.select( 'folders' ); // Select returns an obervable
		this.isFetching = false;

	}

	/**
	 * Load all folders from the server
	 */
	public loadFolders(): void {

		// Fetch data from server
		this.isFetching = true;
		this.http.get( `${ this.appService.API_URL }/folders.mock.json` ) // TODO: Change to REST API

			// Convert data
			.map( ( response: Response ) => <Array<any>> response.json().data )

			// Create action
			.map( ( payload: Array<any> ) => ( { type: LOAD_FOLDERS, payload } ) )

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
	 * Update one value of a folder
	 * @param {number} folderId  Folder ID
	 * @param {string} attribute Attribute
	 * @param {string} newValue  New / updated value
	 */
	public updateFolderValue( folderId: number, attribute: string, newValue: string ): void {
		let data: any = {};
		data[ attribute ] = newValue;
		this.updateFolder( folderId, data );
	}

	/**
	 * Delete one folder, and all the (recursive) subfolders and contained bookmarks
	 * @param {number}        folderId  Folder ID
	 * @param {Array<number>} folderIds List of subfolders
	 */
	public deleteFolder( folderId: number, folderIds: Array<number> ): void {

		// TODO: API CALL

		// Dispatch action
		this.store.dispatch( {
			payload: {
				id: folderId,
				subfolderIds: folderIds
			},
			type: DELETE_FOLDER
		} );

		// Also delete all the bookmarks contained in these folders
		this.bookmarkDataService.deleteAllBookmarksInFolders( folderIds );

	}

	/**
	 * Update folder
	 * @param {number} folderId Folder ID
	 * @param {any}    data     Data
	 */
	private updateFolder( folderId: number, data: any ): void {

		// TODO: API CALL

		// Dispatch action
		this.store.dispatch( {
			payload: {
				data: data,
				id: folderId
			},
			type: UPDATE_FOLDER
		} );

	}
}
