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
	public bookmarks: Observable<{}>;

	/**
	 * Bookmark observer
	 */
	private bookmarkObserver: Observer<{}>;

	/**
	 * Bookmark data store
	 */
	private bookmarkStore: {
		bookmarks: {}
	};

	/**
	 * Http service
	 */
	private http: Http;

	/**
	 * Constructor
	 * @param {Http} http Http service
	 */
	constructor( http: Http ) {

		// Initialize http service
		this.http = http;

		// Create the bookmark observable
		this.bookmarks = new Observable( ( observer: Observer<{}> ) => {
			this.bookmarkObserver = observer;
		} ).share();

		// Setup bookmark store
		this.bookmarkStore = {
			bookmarks: {}
		};

	}

	/**
	 * Get all bookmarks
	 */
	public getBookmarks(): void {

		this.http

			// Get data from API
			// TODO: Switch that to the REST API route, get base from some config service
			.get( 'bookmark.temp.json' )

			// Convert data
			.map( ( response: Response ) => <Bookmark[]> response.json().data )

			// Subscription
			.subscribe(
				( data: Bookmark[] ) => {

					// DESCRIPTION
					// In the following we convert the flat bookmark hierarchy into a deeply structured one
					// TODO: Maybe do this server-side?

					// Setup result
					let result: any = {
						'name': 'root',
						'bookmarks': [],
						'folders': []
					};

					// Iterate through bookmarks
					for ( const bookmark of data ) {

						// Check if the bookmark is on root or in a subfolder
						if ( bookmark.hasOwnProperty( 'path' ) ) {

							// Create all folders
							let currentPath: any = result;
							const pathLength: number = bookmark.path.length;

							// Loop through all folders (improved native for loop here)
							for ( let i: number = pathLength - 1; i >= 0; i-- ) {

								// Get the new folder name
								let folderName: String = bookmark.path[ pathLength - i - 1 ];

								// Check if folder already exists
								let folderPosition: number = -1;
								let foldersLength: number = currentPath.folders.length;
								for (let i: number = foldersLength - 1; i >= 0; i--) {
									if (currentPath.folders[i].name === folderName) {
										folderPosition = i;
										break;
									}
								}

								// Create folder (if it doesn't exist yet)
								if ( folderPosition === -1 ) {

									// Create folder
									let folder: {} = {
										'name': folderName,
										'bookmarks': [],
										'folders': []
									};

									// Push folde to folders list
									let position: number = currentPath.folders.push( folder );

									// Set current handle to new folder
									currentPath = currentPath.folders[ position - 1 ];

								} else {

									// Set current handle to existing folder
									currentPath = currentPath.folders[ folderPosition ];

								}

								// Check if the path building is done
								if ( i === 0 ) {
									currentPath.bookmarks.push( bookmark );
								}

							}

						} else {
							result.bookmarks.push( bookmark );
						}

					}

					// Update bookmark store
					this.bookmarkStore.bookmarks = result;

					// Push to observable stream
					this.bookmarkObserver.next( this.bookmarkStore.bookmarks );
					this.bookmarkObserver.complete();

				},
				( error: any ) => {

					// TODO: Service specific error handling
					console.log( error );
					this.bookmarkObserver.error( error );

				}
			);

	}

}
