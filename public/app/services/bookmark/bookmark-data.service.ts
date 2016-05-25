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
	 * HTTP service
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
	constructor(
		http: Http,
		appService: AppService,
		store: Store<AppStore>
	) {

		// Initialize
		this.http = http;
		this.appService = appService;
		this.store = store;

		// Setup
		this.bookmarks = <Observable<List<Bookmark>>> store.select( 'bookmarks' ); // Select returns an observable

	}

	/**
	 * API request: Load all bookmarks
	 * @return {Promise<any>} Promise when done
	 */
	public loadBookmarks(): Promise<any> {

		return new Promise<any>( ( resolve: Function, reject: Function ) => {
			setTimeout(
				() => {

					this.http

						// Fetch data and parse response
						.get( `${ this.appService.API_URL }/bookmarks.mock.json` )
						.map( ( response: Response ) => <any> response.json() )

						// Dispatch action
						.subscribe(
							( data: any ) => {
								this.store.dispatch( {
									payload: data.data,
									type: LOAD_BOOKMARKS
								} );
								console.log( 'APP > Bookmark Data Service > Bookmarks successfully loaded from the API.' );
								resolve();
							},
							( error: any ) => {
								console.log( 'APP > Bookmark Data Service > Error while loading bookmarks.' );
								console.log( error );
								reject();
							}
						);

				},
				Math.floor( Math.random() * 1001 ) + 1
			);
		} );

		/* TODO: This is the production code

		return new Promise<any>( ( resolve: Function, reject: Function ) => {
			this.http

				// Fetch data and parse response
				.get( `${ this.appService.API_URL }/bookmarks` )
				.map( ( response: Response ) => <any> response.json() )

				// Dispatch action
				.subscribe(
					( data: any ) => {
						this.store.dispatch( {
							payload: data.data,
							type: LOAD_BOOKMARKS
						} );
						console.log( 'APP > Bookmark Data Service > Bookmarks successfully loaded from the API.' );
						resolve();
					},
					( error: any ) => {
						console.log( 'APP > Bookmark Data Service > Error while loading bookmarks.' );
						console.log( error );
						reject();
					}
				);
		} );

		*/

	}

	/**
	 * API request: Add a new bookmark
	 * @param {any} newBookmark Data of the new bookmark
	 */
	public addBookmark( newBookmark: any ): void {

		// TODO: This is only the dev text code, real code follows up
		setTimeout(
			() => {
				newBookmark.id = `BOK${ Math.floor( Math.random() * 11 ) }`;
				this.store.dispatch( {
					payload: {
						data: newBookmark
					},
					type: ADD_BOOKMARK
				} );
			},
			1000
		);

		/* TODO: This is the production code

		this.http

			// Send data and parse response
			.post( `${ this.appService.API_URL }/bookmarks`, JSON.stringify( { data: newBookmark } ) )
			.map( ( response: Response ) => <any> response.json() )

			// Dispatch action
			.subscribe(
				( data: any ) => {
					newBookmark.id = data.data.id; // TODO: Set also the favicon?
					this.store.dispatch( {
						payload: {
							data: newBookmark
						},
						type: ADD_BOOKMARK
					} );
				},
				( error: any ) => {
					// TODO: Proper error handling
					console.error( 'BOOKMARK SERVICE ERROR' );
					console.dir( error );
				}
			);

		*/

	}

	/**
	 * API requst: Update an existing bookmark
	 * @param {string} bookmarkId      Bookmark ID
	 * @param {any}    updatedBookmark Updated bookmark data
	 */
	public updateBookmark( bookmarkId: string, updatedBookmark: any ): void {

		// TODO: This is only the dev text code, real code follows up
		setTimeout(
			() => {
				this.store.dispatch( {
					payload: {
						data: updatedBookmark,
						id: bookmarkId
					},
					type: UPDATE_BOOKMARK
				} );
			},
			1000
		);

		/* TODO: This is the production code

		this.http

			// Send data and parse response
			.put( `${ this.appService.API_URL }/bookmarks/${ bookmarkId }`, JSON.stringify( { data: updatedBookmark } ) )
			.map( ( response: Response ) => <any> response.json() )

			// Dispatch action
			.subscribe(
				( data: any ) => {
					this.store.dispatch( {
						payload: {
							data: updatedBookmark,
							id: bookmarkId
						},
						type: UPDATE_BOOKMARK
					} );
				},
				( error: any ) => {
					// TODO: Proper error handling
					console.error( 'BOOKMARK SERVICE ERROR' );
					console.dir( error );
				}
			);

		*/

	}

	/**
	 * Assign a new label to an existing bookmark (helper function for updating a bookmark)
	 * @param {string}       bookmarkId      Bookmark ID
	 * @param {List<string>} currentLabelIds List of currently assigned labels
	 * @param {string}       newLabelId      ID of the new label
	 */
	public assignLabelToBookmark( bookmarkId: string, currentLabelIds: List<string>, newLabelId: string ): void {
		let updatedLabelIds: any = {
			labels: currentLabelIds.push(newLabelId)
		};
		this.updateBookmark( bookmarkId, updatedLabelIds );
	}

	/**
	 * Unassign a label from an existing bookmark (helper function for updating a bookmark)
	 * @param {string}       bookmarkId      Bookmark ID
	 * @param {List<string>} currentLabelIds List of currently assigned labels
	 * @param {string}       oldLabelId      ID of the label to be removed
	 */
	public unassignLabelFromBookmark( bookmarkId: string, currentLabelIds: List<string>, oldLabelId: string ): void {
		let updatedLabelIds: any = {
			labels: currentLabelIds.filterNot( ( currentLabelId: string ) => currentLabelId === oldLabelId )
		};
		this.updateBookmark( bookmarkId, updatedLabelIds );
	}

	/**
	 * API request: Delete an existing bookmark
	 * @param {string} bookmarkId Bookmark ID
	 */
	public deleteBookmark( bookmarkId: string ): void {

		// TODO: This is only the dev text code, real code follows up
		setTimeout(
			() => {
				this.store.dispatch( {
					payload: {
						id: bookmarkId
					},
					type: DELETE_BOOKMARK
				} );
			},
			1000
		);

		/* TODO: This is the production code

		this.http

			// Send data and parse response
			.delete( `${ this.appService.API_URL }/bookmarks/${ bookmarkId }` )
			.map( ( response: Response ) => <any> response.json() )

			// Dispatch action
			.subscribe(
				( data: any ) => {
					this.store.dispatch( {
						payload: {
							id: bookmarkId
						},
						type: DELETE_BOOKMARK
					} );
				},
				( error: any ) => {
					// TODO: Proper error handling
					console.error( 'BOOKMARK SERVICE ERROR' );
					console.dir( error );
				}
			);

		*/

	}

	/**
	 * Delete all bookmarks within provided folder IDs
	 * Sidenote: Used in combination with deleting a folder (no API call here)
	 * @param {Array<string>} folderIds List of folder IDs
	 */
	public deleteAllBookmarksInFolders( folderIds: Array<string> ): void {

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
	 * Sidenote: Used in combination with deleting a label (no API call here)
	 * @param {string} labelId Label ID
	 */
	public unassignLabelFromAllBookmarks( labelId: string ): void {

		// Dispatch action
		this.store.dispatch( {
			payload: {
				labelId: labelId
			},
			type: UPDATE_BOOKMARKS_UNASSIGN_LABEL
		} );

	}

	/**
	 * Get bookmark template, used when creating a new bookmark
	 * @return {Bookmark} Bookmark template
	 */
	public getBookmarkTemplate(): Bookmark {
		return <Bookmark> Map<string, any>( {
			description: '',
			id: null,
			labels: List<string>(),
			path: null,
			position: null,
			title: 'Unnamed bookmark',
			url: ''
		} );
	}

}
