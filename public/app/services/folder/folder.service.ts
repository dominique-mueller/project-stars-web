/**
 * External imports
 */
import { Injectable } from 'angular2/core';
import { Http, Response } from 'angular2/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { Store, Action } from '@ngrx/store';

/**
 * Internal imports
 */
import { AppService } from './../app/app.service';
import { IAppStore } from './../app/app.store';
import { IFolder } from './folder.model';
import { ADD_FOLDERS } from './folder.store';

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
	public folders: Observable<IFolder[]>;

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
		this.folders = store.select( 'folders' );
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
			.map( ( payload: IFolder[] ) => ( { type: ADD_FOLDERS, payload } ) )

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
	 * Get folder object by a provided path
	 * @param  {IFolder[]} folders List of all folders
	 * @param  {string}    path    Provided path
	 * @return {IFolder}           Folder
	 */
	public getFolderByPath( folders: IFolder[], path: string ): IFolder {

		// Setup result
		let result: IFolder;

		// We are creating and comparing the full path of each folder with our provided path
		for ( const folder of folders ) {

			// Compare the calculated and provided paths
			if ( this.getPathByFolderId( folders, folder.id ) === path) {
				result = folder;
				break;
			}

		}

		// Return our result
		return result;

	}

	/**
	 * Get the relative path by a provided folder id
	 * @param  {IFolder[]} folders  List of all folders
	 * @param  {number}    folderId Provided folder id
	 * @return {string}             Relative folder path
	 */
	public getPathByFolderId( folders: IFolder[], folderId: number ): string {

		// Setup result
		let result: string = '';

		// Ignore the root folder
		if ( folderId !== 0 ) {

			// Temp pointer to the currently selected path
			let currentPathPointer: number = folderId;

			// Full folder path array
			let fullFolderPath: string[] = [];

			// Build the full folder path
			while (currentPathPointer !== 0) {  // Repeat as long as we haven't reached the root yet
				for ( const nextFolder of folders ) {
					if ( nextFolder.id === currentPathPointer ) {
						fullFolderPath.unshift( nextFolder.name ); // Put it in front, building up from the back
						currentPathPointer = nextFolder.path;
						break;
					}
				}
			}

			// Combine the path elements to build the full path
			result = fullFolderPath.join( '/' ).toLowerCase();

		}

		// Return our result
		return result;

	}

	/**
	 * Get subfolders of a folder by its provoded id
	 * @param  {IFolder[]} folders  List of all folders
	 * @param  {number}    folderId Provided folder id
	 * @return {IFolder[]}          List of subfolders
	 */
	public getFoldersByFolderId( folders: IFolder[], folderId: number ): IFolder[] {

		// Setup result
		let result: IFolder[] = [];

		// Choose all subfolders, put them sorted into the result array
		for ( const folder of folders ) {
			if ( folder.path === folderId ) {
				result[ folder.position - 1 ] = folder;
			}
		}

		// Return our result
		return result;

	}

}
