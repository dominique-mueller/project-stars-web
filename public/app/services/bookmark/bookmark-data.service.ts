/**
 * External imports
 */
import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { AuthHttp } from 'angular2-jwt';
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
	 * Authenticated HTTP service
	 */
	private authHttp: AuthHttp;

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
		authHttp: AuthHttp,
		appService: AppService,
		store: Store<AppStore>
	) {

		// Initialize
		this.authHttp = authHttp;
		this.appService = appService;
		this.store = store;

		// Setup
		this.bookmarks = <Observable<List<Bookmark>>> store.select( 'bookmarks' ); // Select returns an observable

	}

	/**
	 * Authenticated API request
	 * Load all bookmarks
	 * @return {Promise<any>} Promise when done
	 */
	public loadBookmarks(): Promise<any> {

		return new Promise<any>( ( resolve: Function, reject: Function ) => {
			this.authHttp

				// Fetch data and parse response
				.get( `${ this.appService.API_URL }/bookmarks` )
				.map( ( response: Response ) => response.status !== 204 ? response.json() : null )

				// Dispatch action
				.subscribe(
					( data: any ) => {
						this.store.dispatch( {
							payload: data.data,
							type: LOAD_BOOKMARKS
						} );
						console.log( 'APP > Bookmark Data Service > Bookmarks successfully loaded.' );
						resolve();
					},
					( error: any ) => {
						console.log( 'APP > Bookmark Data Service > Error while loading bookmarks.' );
						console.log( error );
						reject();
					}
				);
		} );

	}

	/**
	 * Authenticated API request
	 * Add a new bookmark
	 * @param  {any}          newBookmark Data of the new bookmark
	 * @return {Promise<any>}             Promise when done
	 */
	public addBookmark( newBookmark: any ): Promise<any> {

		return new Promise<any>( ( resolve: Function, reject: Function ) => {
			this.authHttp

				// Send data and parse response
				.post( `${ this.appService.API_URL }/bookmarks`, JSON.stringify( { data: newBookmark } ) )
				.map( ( response: Response ) => response.status !== 204 ? response.json() : null )

				// Dispatch action
				.subscribe(
					( data: any ) => {
						newBookmark.id = data.data.id;
						newBookmark.created = data.data.created;
						// TODO: Set also the favicon?
						this.store.dispatch( {
							payload: {
								data: newBookmark
							},
							type: ADD_BOOKMARK
						} );
						console.log( 'APP > Bookmark Data Service > New bookmark successfully added.' );
						resolve();
					},
					( error: any ) => {
						console.log( 'APP > Bookmark Data Service > Error while adding a new bookmark.' );
						console.log( error );
						reject();
					}
				);
		} );

	}

	/**
	 * Authenticated API requst
	 * Update an existing bookmark
	 * @param  {string}       bookmarkId      Bookmark ID
	 * @param  {any}          updatedBookmark Updated bookmark data
	 * @return {Promise<any>}                 Promise when done
	 */
	public updateBookmark( bookmarkId: string, updatedBookmark: any ): Promise<any> {

		return new Promise<any>( ( resolve: Function, reject: Function ) => {
			this.authHttp

				// Send data and parse response
				.put( `${ this.appService.API_URL }/bookmarks/${ bookmarkId }`, JSON.stringify( { data: updatedBookmark } ) )
				.map( ( response: Response ) => response.status !== 204 ? response.json() : null )

				// Dispatch action
				.subscribe(
					( data: any ) => {
						// updatedBookmark.updated = data.data.updated;
						this.store.dispatch( {
							payload: {
								data: updatedBookmark,
								id: bookmarkId
							},
							type: UPDATE_BOOKMARK
						} );
						console.log( 'APP > Bookmark Data Service > Bookmark successfully updated.' );
						resolve();
					},
					( error: any ) => {
						console.log( 'APP > Bookmark Data Service > Error while updating a bookmark.' );
						console.log( error );
						reject();
					}
				);
		} );

	}

	/**
	 * Pre authenticated API request
	 * Assign a new label to an existing bookmark (helper function for updating a bookmark)
	 * @param  {string}       bookmarkId      Bookmark ID
	 * @param  {List<string>} currentLabelIds List of currently assigned labels
	 * @param  {string}       newLabelId      ID of the new label
	 * @return {Promise<any>}                 Promise when done
	 */
	public assignLabelToBookmark(
		bookmarkId: string,
		currentLabelIds: List<string>,
		newLabelId: string ): Promise<any> {

		return new Promise<any>( ( resolve: Function, reject: Function ) => {
			let updatedLabelIds: any = {
				labels: currentLabelIds.push( newLabelId )
			};
			this.updateBookmark( bookmarkId, updatedLabelIds )
				.then( ( data: any ) => {
					resolve( data );
				} )
				.catch( ( error: any ) => {
					reject( error );
				} );
		} );

	}

	/**
	 * Pre authenticated API request
	 * Unassign a label from an existing bookmark (helper function for updating a bookmark)
	 * @param {string}        bookmarkId      Bookmark ID
	 * @param {List<string>}  currentLabelIds List of currently assigned labels
	 * @param {string}        oldLabelId      ID of the label to be removed
	 * @return {Promise<any>}                 Promise when done
	 */
	public unassignLabelFromBookmark(
		bookmarkId: string,
		currentLabelIds: List<string>,
		oldLabelId: string ): Promise<any> {

		return new Promise<any>( ( resolve: Function, reject: Function ) => {
			let updatedLabelIds: any = {
				labels: currentLabelIds.filterNot( ( currentLabelId: string ) => currentLabelId === oldLabelId )
			};
			this.updateBookmark( bookmarkId, updatedLabelIds )
				.then( ( data: any ) => {
					resolve( data );
				} )
				.catch( ( error: any ) => {
					reject( error );
				} );
		} );

	}

	/**
	 * Authenticated API request
	 * Delete an existing bookmark
	 * @param  {string}       bookmarkId Bookmark ID
	 * @return {Promise<any>}            Promise when done
	 */
	public deleteBookmark( bookmarkId: string ): Promise<any> {

		return new Promise<any>( ( resolve: Function, reject: Function ) => {
			this.authHttp

				// Send data and parse response
				.delete( `${ this.appService.API_URL }/bookmarks/${ bookmarkId }` )
				.map( ( response: Response ) => response.status !== 204 ? response.json() : null )

				// Dispatch action
				.subscribe(
					( data: any ) => {
						this.store.dispatch( {
							payload: {
								id: bookmarkId
							},
							type: DELETE_BOOKMARK
						} );
						console.log( 'APP > Bookmark Data Service > Bookmark successfully deleted.' );
						resolve();
					},
					( error: any ) => {
						console.log( 'APP > Bookmark Data Service > Error while deleting a bookmark.' );
						console.log( error );
						reject();
					}
				);
		} );

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
