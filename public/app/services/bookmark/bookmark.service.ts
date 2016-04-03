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
import { IBookmark } from './bookmark.model';
import { LOAD_BOOKMARKS } from './bookmark.store';

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
	public bookmarks: Observable<List<Map<string, any>>>;

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
		this.bookmarks = store.select( 'bookmarks' ); // Returns an observable
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

			// Create action
			.map( ( payload: IBookmark[] ) => ( { type: LOAD_BOOKMARKS, payload } ) )

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
	 * Find a bookmarks (pure function)
	 * @param  {List<Map<string, any>>} bookmarks All bookmarks
	 * @param  {number}                 bookmark  Provided bookmark id
	 * @return {Map<string, any>}                 Bookmark
	 */
	public findBookmark( bookmarks: List<Map<string, any>>, bookmark: number ): Map<string, any> {

		// Find the bookmark
		let result: Map<string, any> = bookmarks.find( ( item: Map<string, any> ) => {
			return item.get( 'id' ) === bookmark;
		} );

		// Return our result
		return typeof result === 'undefined' ? null : result;

	}

	/**
	 * Get bookmarks that live inside a parent folder (pure function)
	 * @param  {List<Map<string, any>>} bookmarks All bookmarks
	 * @param  {number}                 folder    Folder
	 * @return {List}                             Bookmarks
	 */
	public getBookmarksByFolder( bookmarks: List<Map<string, any>>, folder: number ): List<Map<string, any>> {

		// We create a new list and put only the included bookmarks in it (ordered)
		return List<Map<string, any>>().withMutations( ( list: List<Map<string, any>> ) => {
			bookmarks.forEach( ( item: Map<string, any> ) => {
				if ( item.get( 'path' ) === folder ) {
					list.set( item.get( 'position' ) - 1, item );
				}
			} );
		} );

	}

}
