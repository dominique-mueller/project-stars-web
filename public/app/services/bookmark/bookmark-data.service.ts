/**
 * File: Bookmark data service
 */

import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { AuthHttp } from 'angular2-jwt';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { Store, Action } from '@ngrx/store';
import { List, Map } from 'immutable';

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
 */
@Injectable()
export class BookmarkDataService {

	/**
	 * Observable list of all bookmarks
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
	 * @param {AuthHttp}        authHttp   Authenticated HTTP service
	 * @param {AppService}      appService App service
	 * @param {Store<AppStore>} store      App store
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
	 * API request: Load all bookmarks
	 * @return {Promise<any>} Promise when done
	 */
	public loadBookmarks(): Promise<any> {
		return new Promise<any>( ( resolve: Function, reject: Function ) => {
			this.authHttp
				.get( `${ this.appService.API_URL }/bookmarks` )
				.map( ( response: Response ) => response.status !== 204 ? response.json().data : null )
				.subscribe(
					( data: any ) => {
						this.store.dispatch( {
							payload: data,
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
	 * API request: Add a bookmark
	 * @param  {any}          newBookmarkData New bookmark data
	 * @return {Promise<any>}                 Promise when done
	 */
	public addBookmark( newBookmarkData: any ): Promise<any> {
		return new Promise<any>( ( resolve: Function, reject: Function ) => {
			this.authHttp
				.post(
					`${ this.appService.API_URL }/bookmarks`,
					JSON.stringify( { data: newBookmarkData } )
				)
				.map( ( response: Response ) => response.status !== 204 ? response.json().data : null )
				.subscribe(
					( data: any ) => {
						newBookmarkData.id = data.id;
						newBookmarkData.created = data.created;
						// TODO: Set also the favicon?
						this.store.dispatch( {
							payload: {
								data: newBookmarkData
							},
							type: ADD_BOOKMARK
						} );
						console.log( 'APP > Bookmark Data Service > Bookmark successfully added.' );
						resolve();
					},
					( error: any ) => {
						console.log( 'APP > Bookmark Data Service > Error while adding a bookmark.' );
						console.log( error );
						reject();
					}
				);
		} );
	}

	/**
	 * API requst: Update a bookmark
	 * @param  {string}       bookmarkId          Bookmark ID
	 * @param  {any}          updatedBookmarkData Updated bookmark data
	 * @return {Promise<any>}                     Promise when done
	 */
	public updateBookmark( bookmarkId: string, updatedBookmarkData: any ): Promise<any> {
		return new Promise<any>( ( resolve: Function, reject: Function ) => {
			this.authHttp
				.put(
					`${ this.appService.API_URL }/bookmarks/${ bookmarkId }`,
					JSON.stringify( { data: updatedBookmarkData } )
				)
				.map( ( response: Response ) => response.status !== 204 ? response.json().data : null )
				.subscribe(
					( data: any ) => {
						// TODO: Set updated with 'updatedBookmarkData.updated = data.updated'
						this.store.dispatch( {
							payload: {
								data: updatedBookmarkData,
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
	 * API request bridge: Assign a new label to a bookmark
	 * @param  {string}       bookmarkId      Bookmark ID
	 * @param  {List<string>} currentLabelIds List of currently assigned label IDs
	 * @param  {string}       labelId         ID of the label to be assigned
	 * @return {Promise<any>}                 Promise when done
	 */
	public assignLabelToBookmark( bookmarkId: string, currentLabelIds: List<string>, labelId: string ): Promise<any> {
		return new Promise<any>( ( resolve: Function, reject: Function ) => {
			let updatedLabelIds: any = {
				labels: currentLabelIds.push( labelId )
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
	 * API request bridge: Unassign a label from a bookmark
	 * @param  {string}       bookmarkId      Bookmark ID
	 * @param  {List<string>} currentLabelIds List of currently assigned label IDs
	 * @param  {string}       labelId         ID of the label to be removed
	 * @return {Promise<any>}                 Promise when done
	 */
	public unassignLabelFromBookmark( bookmarkId: string, currentLabelIds: List<string>, labelId: string ): Promise<any> {
		return new Promise<any>( ( resolve: Function, reject: Function ) => {
			let updatedLabelIds: any = {
				labels: currentLabelIds.filterNot( ( currentLabelId: string ) => currentLabelId === labelId )
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
	 * API request: Delete a bookmark
	 * @param  {string}       bookmarkId Bookmark ID
	 * @return {Promise<any>}            Promise when done
	 */
	public deleteBookmark( bookmarkId: string ): Promise<any> {
		return new Promise<any>( ( resolve: Function, reject: Function ) => {
			this.authHttp
				.delete( `${ this.appService.API_URL }/bookmarks/${ bookmarkId }` )
				.map( ( response: Response ) => response.status !== 204 ? response.json().data : null )
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
	 * Delete all bookmarks that exist within a list of provided folder IDs
	 * Sidenote: Used in combination with deleting a folder
	 * @param {Array<string>} folderIds List of folder IDs
	 */
	public deleteAllBookmarksInFolders( folderIds: Array<string> ): void {
		this.store.dispatch( {
			payload: {
				folderIds: folderIds
			},
			type: DELETE_FOLDER_BOOKMARKS
		} );
	}

	/**
	 * Unassign a label from all bookmarks it currently is assigned to
	 * Sidenote: Used in combination with deleting a label
	 * @param {string} labelId Label ID
	 */
	public unassignLabelFromAllBookmarks( labelId: string ): void {
		this.store.dispatch( {
			payload: {
				labelId: labelId
			},
			type: UPDATE_BOOKMARKS_UNASSIGN_LABEL
		} );
	}

	/**
	 * Get bookmark template, used as a basis when creating a new bookmark
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
