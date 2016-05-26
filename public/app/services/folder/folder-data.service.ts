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
import { BookmarkDataService } from './../bookmark';
import { AppStore, AppService } from './../app';
import { Folder } from './folder.model';
import {
	LOAD_FOLDERS,
	ADD_FOLDER,
	UPDATE_FOLDER,
	DELETE_FOLDER,
	DELETE_FOLDERS
} from './folder.store';

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
	 * HTTP service
	 */
	private http: Http;

	/**
	 * App Service
	 */
	private appService: AppService;

	/**
	 * App store
	 */
	private store: Store<AppStore>;

	/**
	 * Bookmark data service
	 */
	private bookmarkDataService: BookmarkDataService;

	/**
	 * Constructor
	 */
	constructor(
		http: Http,
		appService: AppService,
		store: Store<AppStore>,
		bookmarkDataService: BookmarkDataService
	) {

		// Initialize
		this.http = http;
		this.appService = appService;
		this.store = store;
		this.bookmarkDataService = bookmarkDataService;

		// Setup
		this.folders = <Observable<List<Folder>>> store.select( 'folders' ); // Select returns an obervable

	}

	/**
	 * API request: Load all folders
	 * @return {Promise<any>} Promise when done
	 */
	public loadFolders(): Promise<any> {

		return new Promise<any>( ( resolve: Function, reject: Function ) => {
			setTimeout(
				() => {

					this.http

						// Fetch data and parse response
						.get( `${ this.appService.API_URL }/folders.mock.json` )
						.map( ( response: Response ) => <any> response.json() )

						// Dispatch action
						.subscribe(
							( data: any ) => {
								this.store.dispatch( {
									payload: data.data,
									type: LOAD_FOLDERS
								} );
								console.log( 'APP > Folder Data Service > Folders successfully loaded from the API.' );
								resolve();
							},
							( error: any ) => {
								console.log('APP > Folder Data Service > Error while loading folders.');
								console.log( error );
								reject();
							}
						);

				},
				Math.floor( Math.random() * 3000 ) + 1
			);
		} );

		/* TODO: This is the production code

		return new Promise<any>( ( resolve: Function, reject: Function ) => {
			this.http

				// Fetch data and parse response
				.get( `${ this.appService.API_URL }/folders` )
				.map( ( response: Response ) => <any> response.json() )

				// Dispatch action
				.subscribe(
					( data: any ) => {
						this.store.dispatch( {
							payload: data.data,
							type: LOAD_FOLDERS
						} );
						console.log( 'APP > Folder Data Service > Folders successfully loaded from the API.' );
						resolve();
					},
					( error: any ) => {
						console.log('APP > Folder Data Service > Error while loading folders.');
						console.log( error );
						reject();
					}
				);
		} );

		*/

	}

	/**
	 * API request: Add a new folder
	 * @param {any} newFolder Data of the new folder
	 */
	public addFolder( newFolder: any ): void {

		// TODO: This is only the dev text code, real code follows up
		setTimeout(
			() => {
				newFolder.id = `FOL${ Math.floor( Math.random() * 110 ) }`;
				this.store.dispatch( {
					payload: {
						data: newFolder
					},
					type: ADD_FOLDER
				} );
			},
			1000
		);

		/* TODO: This is the production code

		this.http

			// Send data and parse response
			.post( `${ this.appService.API_URL }/folders`, JSON.stringify( { data: newFolder } ) )
			.map( ( response: Response ) => <any> response.json() )

			// Dispatch action
			.subscribe(
				( data: any ) => {
					newFolder.id = data.data.id;
					this.store.dispatch( {
						payload: {
							data: newFolder
						},
						type: ADD_FOLDER
					} );
				},
				( error: any ) => {
					// TODO: Proper error handling
					console.error( 'FOLDER SERVICE ERROR' );
					console.dir( error );
				}
			);

		*/

	}

	/**
	 * API request: Update an existing folder
	 * @param {string} folderId      Folder ID
	 * @param {any}    updatedFolder Updated folder data
	 */
	public updateFolder( folderId: string, updatedFolder: any ): void {

		// TODO: This is only the dev text code, real code follows up
		setTimeout(
			() => {
				this.store.dispatch( {
					payload: {
						data: updatedFolder,
						id: folderId
					},
					type: UPDATE_FOLDER
				} );
			},
			1000
		);

		/* TODO: This is the production code

		this.http

			// Send data and parse response
			.put( `${ this.appService.API_URL }/folders/${ folderId }`, JSON.stringify( { data: updatedFolder } ) )
			.map( ( response: Response ) => <any> response.json() )

			// Dispatch action
			.subscribe(
				( data: any ) => {
					this.store.dispatch( {
						payload: {
							data: updatedFolder,
							id: folderId
						},
						type: UPDATE_FOLDER
					} );
				},
				( error: any ) => {
					// TODO: Proper error handling
					console.error( 'FOLDER SERVICE ERROR' );
					console.dir( error );
				}
			);

		*/

	}

	/**
	 * API request: Delete an existing folder
	 * Sidenote: This will also (recursively) delete all subfolders and contained bookmarks
	 * @param {string}        folderId     Folder ID
	 * @param {Array<string>} subfolderIds List of subfolders that also should be deleted
	 */
	public deleteFolder( folderId: string, subfolderIds: Array<string> ): void {

		// TODO: This is only the dev text code, real code follows up
		setTimeout(
			() => {

				// Delete this folder
				this.store.dispatch( {
					payload: {
						id: folderId
					},
					type: DELETE_FOLDER
				} );

				// Also (recursively) delete all contained subfolders
				this.deleteMultipleFolders( subfolderIds );

				// Also delete all the bookmarks contained in these folders
				this.bookmarkDataService.deleteAllBookmarksInFolders( subfolderIds );

			},
			1000
		);

		/* TODO: This is the production code

		this.http

			// Send data and parse response
			.delete( `${ this.appService.API_URL }/folders/${ folderId }` )
			.map( ( response: Response ) => <any> response.json() )

			// Dispatch action
			.subscribe(
				( data: any ) => {

					// Delete this folder
					this.store.dispatch( {
						payload: {
							id: folderId
						},
						type: DELETE_FOLDER
					} );

					// Also (recursively) delete all contained subfolders
					this.deleteMultipleFolders( subfolderIds );

					// Also delete all the bookmarks contained in these folders
					this.bookmarkDataService.deleteAllBookmarksInFolders( subfolderIds );

				},
				( error: any ) => {
					// TODO: Proper error handling
					console.error( 'FOLDER SERVICE ERROR' );
					console.dir( error );
				}
			);

		*/

	}

	/**
	 * Delete multiple folders
	 * Sidenote: Used in combination with deleting a folder (no API call here)
	 * @param {Array<string>} folderIds List of folder IDs
	 */
	public deleteMultipleFolders( folderIds: Array<string> ): void {

		// Dispatch action
		this.store.dispatch( {
			payload: {
				folderIds: folderIds
			},
			type: DELETE_FOLDERS
		} );

	}

	/**
	 * Get folder template, used when creating a new folder
	 * @return {Folder} Folder template
	 */
	public getFolderTemplate(): Folder {
		return <Folder> Map<string, any>( {
			description: '',
			id: null,
			isRoot: false,
			name: 'Unnamed folder'
		} );
	}

}
