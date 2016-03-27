/**
 * External imports
 */
import { Injectable } from 'angular2/core';
import { Http, Response } from 'angular2/http';
import { Observable } from 'rxjs/Observable';
import { Store, Action } from '@ngrx/store';

/**
 * Internal imports
 */
import { AppService } from './../app/app.service';
import { IAppStore } from './../app/app.store';
import { IBookmark } from './bookmark.model';
import { ADD_BOOKMARKS } from './bookmark.store';

/**
 * Exports
 */
export { IBookmark } from './bookmark.model';

/**
 * Bookmark service
 */
@Injectable()
export class BookmarkService {

	/**
	 * Bookmarks
	 */
	public bookmarks: Observable<IBookmark[]>;

	/**
	 * Is fetching status flag
	 */
	public isFetching: boolean;

	/**
	 * Http service
	 */
	private http: Http;

	/**
	 * App service
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
		this.bookmarks = store.select( 'bookmarks' );
		this.isFetching = false;

	}

	/**
	 * Load bookmarks from server
	 */
	public loadBookmarks(): void {

		this.isFetching = true;

		this.http

			// Fetch data from server
			.get( `${ this.appService.API_URL }/bookmarks.mock.json` )

			// Convert data
			.map( ( response: Response ) => <IBookmark[]> response.json().data )

			// Create action - TODO: Contant
			.map( ( payload: IBookmark[] ) => ( { type: ADD_BOOKMARKS, payload } ) )

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
	 * Get bookmarks of a folder by its provided id
	 * @param  {IBookmark[]} bookmarks List of all bookmarks
	 * @param  {number}      folderId  Provided folder id
	 * @return {IBookmark[]}           List of contained bookmarks
	 */
	public getBookmarksByFolderId( bookmarks: IBookmark[], folderId: number ): IBookmark[] {

		// Setup result
		let result: IBookmark[] = [];

		// Choose all bookmarks, put them sorted into the result array
		for ( const bookmark of bookmarks ) {
			if ( bookmark.path === folderId ) {
				result[ bookmark.position - 1 ] = bookmark;
			}
		}

		// Return our result
		return result;

	}

}
