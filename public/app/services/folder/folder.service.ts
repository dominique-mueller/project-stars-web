/**
 * External imports
 */
import { Injectable } from 'angular2/core';
import { Http, Response } from 'angular2/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { Store, Action } from '@ngrx/store';
import { List, Map } from 'immutable';

/**
 * Internal imports
 */
import { AppService } from './../app/app.service';
import { IAppStore } from './../app/app.store';
import { IFolder } from './folder.model';
import { LOAD_FOLDERS } from './folder.store';

/**
 * Exports
 */
export { IFolder } from './folder.model';

/**
 * Folder service
 */
@Injectable()
export class FolderService {

	/**
	 * Folders
	 */
	public folders: Observable<List<Map<string, any>>>;

	/**
	 * Is fetching status flag
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
	 * App store
	 */
	private store: Store<IAppStore>;

	/**
	 * Constructor
	 * @param {Http}             http       Http service
	 * @param {AppService}       appService App service
	 * @param {Store<IAppStore>} store      App store
	 */
	constructor( http: Http, appService: AppService, store: Store<IAppStore> ) {

		// Initialize services
		this.http = http;
		this.appService = appService;
		this.store = store;

		// Setup
		this.folders = store.select( 'folders' ); // Returns an obervable
		this.isFetching = false;

	}

	/**
	 * Load folders from server
	 */
	public loadFolders(): void {

		this.isFetching = true;

		this.http

			// Fetch data from server
			.get( `${ this.appService.API_URL }/folders.mock.json` )

			// Convert data
			.map( ( response: Response ) => <IFolder[]> response.json().data )

			// Create action
			.map( ( payload: IFolder[] ) => ( { type: LOAD_FOLDERS, payload } ) )

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
	 * Find a folder (pure function)
	 * @param  {List<Map<string, any>>} folders All folders
	 * @param  {number}                 folder  Provided folder id
	 * @return {Map<string, any>}               Folder
	 */
	public findFolder( folders: List<Map<string, any>>, folder: number ): Map<string, any> {

		// Find the folder
		let result: Map<string, any> = folders.find( ( item: Map<string, any> ) => {
			return item.get( 'id' ) === folder;
		});

		// Return our result
		return typeof result === 'undefined' ? null : result;

	}

	/**
	 * Get a folder by providing a path
	 * @param  {List<Map<string, any>>} folders List of all folders
	 * @param  {string}                 path    Provided path
	 * @return {number}                         Folder
	 */
	public getFolderByPath( folders: List<Map<string, any>>, path: string ): number {

		// Find folder
		let result: Map<string, any> = folders.find( ( item: Map<string, any> ) => {
			return this.getPathByFolder( folders, item.get( 'id' ) ) === path;
		} );

		// Return our result
		return ( typeof result === 'undefined' ) ? null : result.get( 'id' );

	}

	/**
	 * Get a relative path by providing a folder
	 * @param  {List<Map<string, any>>} folders List of all folders
	 * @param  {number}                 folder  Provided folder
	 * @return {string}                         Path
	 */
	public getPathByFolder( folders: List<Map<string, any>>, folder: number ): string {

		// Setup result
		let result: string = '';

		// Ignore the root folder
		if ( folder !== 0 ) {

			// Temporary pointer to the currently selected path (for the loop)
			let pointerToCurrentPath: number = folder;

			// Full folder path array
			let folderPath: string[] = [];

			// Build the full folder path
			while ( pointerToCurrentPath !== 0 ) {  // Repeat as long as we haven't reached the root yet

				// Find parent folder
				let parentFolder: Map<string, any> = folders.find( ( item: Map<string, any> ) => {
					return item.get( 'id' ) === pointerToCurrentPath;
				} );
				folderPath.unshift( parentFolder.get( 'name' ) );
				pointerToCurrentPath = parentFolder.get( 'path' );

			}

			// Combine the path elements to build the full path
			result = folderPath.join( '/' ).toLowerCase();

		}

		// Return our result
		return result;

	}

	 /**
	  * Get all folders that live inside a parent folder (pure function)
	  * @param  {List<Map<string, any>>} folders      All folders
	  * @param  {number}                 parentFolder Id of the parent folder
	  * @return {List}                                Subfolders
	  */
	public getSubfolders( folders: List<Map<string, any>>, parentFolder: number ): List<Map<string, any>> {

		// We create a new list and put only the subfolders in it (ordered)
		return List<Map<string, any>>().withMutations( ( list: List<Map<string, any>> ) => {
			folders.forEach( ( item: Map<string, any> ) => {
				if ( item.get( 'path' ) === parentFolder ) {
					list.set( item.get( 'position' ) - 1, item );
				}
			} );
		} );

	}

}
