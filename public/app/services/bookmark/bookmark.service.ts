/**
 * Imports
 */
import { Injectable } from 'angular2/core';
import { Http, Response } from 'angular2/http';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/share';
import { Bookmark } from './bookmark.model';

/**
 * Exports
 */
export { Bookmark } from './bookmark.model';

/**
 * Bookmark service
 */
@Injectable()
export class BookmarkService {

	/**
	 * Bookmarks
	 */
	public bookmarks: Observable<Array<any>>;

	/**
	 * Folder structure
	 */
	public folderStructure: Observable<Array<any>>;

	/**
	 * Bookmarks observer
	 */
	private bookmarksObserver: Observer<Array<any>>;

	/**
	 * Folder structure observer
	 */
	private folderStructureObserver: Observer<Array<any>>;

	/**
	 * Bookmark data store - TODO - have flat and structured bookmarks
	 */
	private bookmarkStore: {
		bookmarks: any[], // TODO - Create model
		folderStructure: any[] // TODO - Create model
	};

	/**
	 * Http service
	 */
	private http: Http;

	/**
	 * List of ongoing requests (for preventing multiple parallel requests)
	 */
	private currentHttpRequests: {
		'getAll': boolean
	};

	/**
	 * Constructor
	 * @param {Http} http Http service
	 */
	constructor( http: Http ) {

		// Initialize http service
		this.http = http;

		// Setup bookmarks observable
		this.bookmarks = new Observable( ( observer: Observer<Array<any>> ) => {
			this.bookmarksObserver = observer;
		} ).share();

		// Setup folder structur observable
		this.folderStructure = new Observable( ( observer: Observer<Array<any>> ) => {
			this.folderStructureObserver = observer;
		} ).share();

		// Setup bookmark store
		this.bookmarkStore = {
			bookmarks: [],
			folderStructure: []
		};

		// Setup current http requests object
		this.currentHttpRequests = {
			'getAll': false
		};

	}

	/**
	 * Get folder structure
	 */
	public getFolderStructure( preferCached: boolean = true ): void {

		// Return cached data
		if ( this.bookmarkStore.folderStructure.length > 0 ) {
			this.bookmarksObserver.next( this.bookmarkStore.folderStructure );
			this.bookmarksObserver.complete();
		}

		// Return fresh data
		if ( !preferCached || this.bookmarkStore.folderStructure.length === 0 ) {

			// Setup temp bookmarks subscription
			let tempSubscription: Subscription = this.bookmarks
				.subscribe(
					( data: any[] ) => {

						// Unsubscibe directly
						tempSubscription.unsubscribe();

						// Folder structure setup
						let folderStructure: any[] = [
							{
								'name': '',
								'path': '',
								'folders': []
							}
						];

						// Iterate through all paths
						for (const path of data) {

							// Check if there is a path
							if (path.hasOwnProperty('path') && path.path.length > 0 && path.path[0] !== '') {

								// Save current path
								let currentPath: any = folderStructure[0].folders;

								// Iterate through path folders
								for (const currentFolder of path.path) {

									// Iterate thgouth existing folders
									let folderPosition: number = -1;
									let numberOfFolders: number = currentPath.length;
									for (let i: number = numberOfFolders - 1; i >= 0; i--) {
										if (currentPath[i].name === currentFolder) {
											folderPosition = i;
											break;
										}
									}
									// Create folder if it doesn't exist yet
									if (folderPosition === -1) {
										let folder: any = {
											'name': currentFolder,
											'path': path.path.join( '/' ),
											'folders': []
										};
										folderPosition = currentPath.push(folder) - 1;
									}

									// Update current path
									currentPath = currentPath[folderPosition].folders;

								}

							}

						}

						// console.log('FOLDER STRUCTURE');
						// console.log(folderStructure);

						// Update bookmark store
						this.bookmarkStore.folderStructure = folderStructure;

						// Push to observable stream
						this.folderStructureObserver.next( this.bookmarkStore.folderStructure );
						this.folderStructureObserver.complete();

					},
					(error: any) => {
						console.log( 'Service error message' ); // TODO: Throw an error back (like below)
					}
				);

			// Get bookmarks
			this.getBookmarks();

		}

	}

	/**
	 * Get all bookmarks
	 * @param {boolean = true} preferCached Per default cached values are prefered, but setting this to false will
	 * ensure that we're getting fresh data from the server
	 */
	public getBookmarks( preferCached: boolean = true ): void {

		// Choice 1: Return cached data first
		if ( this.bookmarkStore.bookmarks.length > 0 ) {
			this.bookmarksObserver.next(this.bookmarkStore.bookmarks);
			this.bookmarksObserver.complete();
		}

		// Choice 2: Someone is already requesting that data, he will get that data via the subscription automatically
		if ( this.currentHttpRequests.getAll ) {
			return;
		}

		// Choice 3: Load fresh data from the server
		if ( !preferCached || this.bookmarkStore.bookmarks.length === 0 ) {

			// We are requesting data now
			this.currentHttpRequests.getAll = true;

			// Then make the HTTP request
			this.http

				// Get data from API
				// TODO: Switch that to the REST API route, get base from some config service
				.get( 'http://localhost:3000/bookmark.temp.json' )

				// Convert data
				.map( ( response: Response ) => <any[]> response.json().data )

				// Subscription
				.subscribe(
					( data: any[] ) => {

						// console.log('BOOKMARK DATA');
						// console.log(data);

						// Update bookmark store
						this.bookmarkStore.bookmarks = data;

						// Push to observable stream
						this.bookmarksObserver.next( this.bookmarkStore.bookmarks );
						this.bookmarksObserver.complete();

						// We are done here
						this.currentHttpRequests.getAll = false;

						// DESCRIPTION
						// In the following we convert the flat bookmark hierarchy into a deeply structured one
						// TODO: Maybe do this server-side?

						// Setup result
						// let result: any = {
						// 	'name': 'root',
						// 	'bookmarks': [],
						// 	'folders': []
						// };

						// // Iterate through bookmarks
						// for ( const bookmark of data ) {

						// 	// Check if the bookmark is on root or in a subfolder
						// 	if ( bookmark.hasOwnProperty( 'path' ) ) {

						// 		// Create all folders
						// 		let currentPath: any = result;
						// 		const pathLength: number = bookmark.path.length;

						// 		// Loop through all folders (improved native for loop here)
						// 		for ( let i: number = pathLength - 1; i >= 0; i-- ) {

						// 			// Get the new folder name
						// 			let folderName: String = bookmark.path[ pathLength - i - 1 ];

						// 			// Check if folder already exists
						// 			let folderPosition: number = -1;
						// 			let foldersLength: number = currentPath.folders.length;
						// 			for (let i: number = foldersLength - 1; i >= 0; i--) {
						// 				if (currentPath.folders[i].name === folderName) {
						// 					folderPosition = i;
						// 					break;
						// 				}
						// 			}

						// 			// Create folder (if it doesn't exist yet)
						// 			if ( folderPosition === -1 ) {

						// 				// Create folder
						// 				let folder: {} = {
						// 					'name': folderName,
						// 					'bookmarks': [],
						// 					'folders': []
						// 				};

						// 				// Push folde to folders list
						// 				let position: number = currentPath.folders.push( folder );

						// 				// Set current handle to new folder
						// 				currentPath = currentPath.folders[ position - 1 ];

						// 			} else {

						// 				// Set current handle to existing folder
						// 				currentPath = currentPath.folders[ folderPosition ];

						// 			}

						// 			// Check if the path building is done
						// 			if ( i === 0 ) {
						// 				currentPath.bookmarks.push( bookmark );
						// 			}

						// 		}

						// 	} else {
						// 		result.bookmarks.push( bookmark );
						// 	}

						// }

						// Update bookmark store
						// this.bookmarkStore.folderStructure = folderStructure;

						// Push to observable stream
						// this.folderStructureObserver.next( this.bookmarkStore.folderStructure );
						// this.folderStructureObserver.complete();

					},
					( error: any ) => {

						// TODO: Service specific error handling
						console.log( error );
						this.bookmarksObserver.error( error );
						this.folderStructureObserver.error( error );

					}
				);

		}

	}

}
