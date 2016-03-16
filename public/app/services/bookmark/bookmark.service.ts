/**
 * External imports
 */
import { Injectable } from 'angular2/core';
import { Http, Response } from 'angular2/http';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/share';

/**
 * Internal imports
 */
import { Bookmark } from './bookmark.model';
import { Directory } from './directory.model';

/**
 * Exports
 */
export { Bookmark } from './bookmark.model';
export { Directory } from './directory.model';

/**
 * Bookmark service
 */
@Injectable()
export class BookmarkService {

	/**
	 * Bookmarks
	 */
	public bookmarks: Observable<Directory[]>;

	/**
	 * Bookmarks observer
	 */
	private bookmarksObserver: Observer<Directory[]>;

	/**
	 * Bookmark data store
	 */
	private bookmarkStore: {
		bookmarks: Directory[]
	};

	/**
	 * Http service
	 */
	private http: Http;

	/**
	 * Details about ongoing requests (for preventing multiple parallel requests)
	 */
	private isDoingHttpRequests: {
		get: boolean
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
		} ).share(); // Make it hot

		// Setup bookmark store
		this.bookmarkStore = {
			bookmarks: []
		};

		// Setup current http requests object
		this.isDoingHttpRequests = {
			get: false
		};

	}

	/**
	 * Get all bookmarks
	 * @param {boolean = true} preferCached Per default cached values are prefered, but setting this to false will
	 * ensure that we're getting fresh data from the server
	 */
	public loadBookmarks( preferCached: boolean = true ): void {

		// Precalc bookmarks length
		let numberOfBookmarks: number = this.bookmarkStore.bookmarks.length;

		// Check 1:
		// Return cached bookmarks first (no matter what you do, this will happen every time!)
		if ( numberOfBookmarks > 0 ) {
			this.bookmarksObserver.next( this.bookmarkStore.bookmarks );
			this.bookmarksObserver.complete();
		}

		// Check 2:
		// If someone is already requesting that data, the caller will get it via its subscription automatically
		if ( this.isDoingHttpRequests.get ) {
			return;
		}

		// Check 3:
		// Load fresh data from the server
		if ( !preferCached || numberOfBookmarks === 0 ) {

			// Starting http request
			this.isDoingHttpRequests.get = true;

			// Then make the HTTP request
			this.http

				// Get data from API
				// TODO: Switch that to the REST API route, get base from some config service
				.get( 'http://localhost:3000/bookmark.temp.json' )

				// Convert data
				.map( ( response: Response ) => <Directory[]> response.json().data )

				// Subscription
				.subscribe(
					( data: any[] ) => {

						// Update bookmark store
						this.bookmarkStore.bookmarks = data;

						// Push to observable stream
						this.bookmarksObserver.next( this.bookmarkStore.bookmarks );
						this.bookmarksObserver.complete();

						// Done with http request
						this.isDoingHttpRequests.get = false;

					},
					( error: any ) => {

						// TODO: Service specific error handling
						console.log( error );
						this.bookmarksObserver.error( error ); // TODO: Do I need complete() here ?

					}
				);

		}

	}

	/**
	 * Utilify unction: Get bookmarks by a provided path
	 * @param  {Directory[]}        data Bookmark data
	 * @param  {string}             path Provided path
	 * @return {Promise<Directory>}      Resolves with data or rejects with error message
	 */
	public getBookmarksByPath( data: Directory[], path: string ): Promise<Directory> {

		// Return promise
		return new Promise<Directory>( ( resolve: ( result: Directory ) => void, reject: ( reason: string ) => void ) => {

			// Set current path (to bookmarks root folder)
			let currentPath: Directory = data[ 0 ];

			// Only run the algorithm if we are not in the root folder
			// (because then we know the bookmarks already)
			if ( path !== '' ) {

				// Split path by '/'s
				let pathSections: string[] = path.split( '/' );

				// Iterate through path sections
				let pathDepth: number = pathSections.length - 1;
				for ( let i: number = pathDepth; i >= 0; i-- ) {

					// Iterate through available folders
					let numberOfFolders: number = currentPath.folders.length - 1;
					for ( let j: number = numberOfFolders; j >= 0; j-- ) {

						// Find the folder that matches the path section
						if ( pathSections[ pathDepth - i ].toLowerCase() === currentPath.folders[ j ].path.toLowerCase() ) {
							currentPath = currentPath.folders[ j ];
							break;
						}

						// If we did not break out of the loop yet, the bookmark folder does not exist
						if (j === 0) {
							reject( 'Bookmark path does not exist.' );
						}

					}

				}

			}

			// RESOLVE
			resolve( currentPath );

		} );

	}

}
