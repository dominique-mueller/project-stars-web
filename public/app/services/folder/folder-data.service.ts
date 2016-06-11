/**
 * File: Folder data service
 */

import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { AuthHttp } from 'angular2-jwt';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { Store, Action } from '@ngrx/store';
import { List, Map } from 'immutable';

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
 */
@Injectable()
export class FolderDataService {

	/**
	 * Observable list of all folders
	 */
	public folders: Observable<List<Folder>>;

	/**
	 * Authenticated HTTP service
	 */
	private authHttp: AuthHttp;

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
	 * @param {AuthHttp}            authHttp            Authenticated HTTP service
	 * @param {AppService}          appService          App service
	 * @param {Store<AppStore>}     store               App store
	 * @param {BookmarkDataService} bookmarkDataService Bookmark data service
	 */
	constructor(
		authHttp: AuthHttp,
		appService: AppService,
		store: Store<AppStore>,
		bookmarkDataService: BookmarkDataService
	) {

		// Initialize
		this.authHttp = authHttp;
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
			this.authHttp
				.get( `${ this.appService.API_URL }/folders` )
				.map( ( response: Response ) => response.status !== 204 ? response.json().data : null )
				.subscribe(
					( data: any ) => {
						this.store.dispatch( {
							payload: data,
							type: LOAD_FOLDERS
						} );
						console.log( 'APP > Folder Data Service > Folders successfully loaded.' );
						resolve();
					},
					( error: any ) => {
						console.log( 'APP > Folder Data Service > Error while loading folders.' );
						console.log( error );
						reject();
					}
				);
		} );
	}

	/**
	 * API request: Add a folder
	 * @param  {any}          newFolderData New folder data
	 * @return {Promise<any>}               Promise when done
	 */
	public addFolder( newFolderData: any ): Promise<any> {
		return new Promise<any>( ( resolve: Function, reject: Function ) => {
			this.authHttp
				.post(
					`${ this.appService.API_URL }/folders`,
					JSON.stringify( { data: newFolderData } )
				)
				.map( ( response: Response ) => response.status !== 204 ? response.json().data : null )
				.subscribe(
					( data: any ) => {
						newFolderData.id = data.id;
						newFolderData.created = data.created;
						this.store.dispatch( {
							payload: {
								data: newFolderData
							},
							type: ADD_FOLDER
						} );
						console.log( 'APP > Folder Data Service > Folder successfully added.' );
						resolve();
					},
					( error: any ) => {
						console.log( 'APP > Folder Data Service > Error while adding a folder.' );
						console.log( error );
						reject();
					}
				);
		} );
	}

	/**
	 * API request: Update a folder
	 * @param  {string}       folderId          Folder ID
	 * @param  {any}          updatedFolderData Updated folder data
	 * @return {Promise<any>}                   Promise when done
	 */
	public updateFolder( folderId: string, updatedFolderData: any ): Promise<any> {
		return new Promise<any>( ( resolve: Function, reject: Function ) => {
			this.authHttp
				.put(
					`${ this.appService.API_URL }/folders/${ folderId }`,
					JSON.stringify( { data: updatedFolderData } )
				)
				.map( ( response: Response ) => response.status !== 204 ? response.json().data : null )
				.subscribe(
					( data: any ) => {
						// TODO: Set updated with 'updatedFolderData.updated = data.updated'
						this.store.dispatch( {
							payload: {
								data: updatedFolderData,
								id: folderId
							},
							type: UPDATE_FOLDER
						} );
						console.log( 'APP > Folder Data Service > Folder successfully updated.' );
						resolve();
					},
					( error: any ) => {
						console.log( 'APP > Folder Data Service > Error while updating a folder.' );
						console.log( error );
						reject();
					}
				);
		} );
	}

	/**
	 * API request: Delete a folder
	 * Sidenote: This will also (recursively) delete all subfolders and contained bookmarks
	 * @param  {string}        folderId     Folder ID
	 * @param  {Array<string>} subfolderIds List of subfolders that also should be deleted
	 * @return {Promise<any>}               Promise when done
	 */
	public deleteFolder( folderId: string, subfolderIds: Array<string> ): Promise<any> {
		return new Promise<any>( ( resolve: Function, reject: Function ) => {
			this.authHttp
				.delete( `${ this.appService.API_URL }/folders/${ folderId }` )
				.map( ( response: Response ) => response.status !== 204 ? response.json().data : null )
				.subscribe(
					( data: any ) => {
						this.store.dispatch( {
							payload: {
								id: folderId
							},
							type: DELETE_FOLDER
						} );

						// Also (recursively) delete all folders and bookmarks within this folder
						this.deleteMultipleFolders( subfolderIds );
						this.bookmarkDataService.deleteAllBookmarksInFolders( subfolderIds );

						console.log( 'APP > Folder Data Service > Folder successfully deleted.' );
						resolve();
					},
					( error: any ) => {
						console.log( 'APP > Folder Data Service > Error while deleting a folder.' );
						console.log( error );
						reject();
					}
				);
		} );
	}

	/**
	 * Delete a list of multiple folders
	 * Sidenote: Used in combination with deleting a folder
	 * @param {Array<string>} folderIds List of folder IDs
	 */
	public deleteMultipleFolders( folderIds: Array<string> ): void {
		this.store.dispatch( {
			payload: {
				folderIds: folderIds
			},
			type: DELETE_FOLDERS
		} );
	}

	/**
	 * Get folder template, used as a basis when creating a new folder
	 * @return {Folder} Folder template
	 */
	public getFolderTemplate(): Folder {
		return <Folder> Map<string, any>( {
			created: null,
			description: '',
			id: null,
			isRoot: false,
			name: 'Unnamed folder',
			updated: null
		} );
	}

}
