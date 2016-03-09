/**
 * Imports
 */
import { Injectable } from 'angular2/core';
import { Http, Response } from 'angular2/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Bookmark } from './bookmark.model';
import { Label } from '../label/label.model';

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
	 * Http service
	 */
	public http: Http;

	/**
	 * Constructor
	 * @param {Http} http Http service
	 */
	constructor( http: Http ) {
		this.http = http;
	}

	/**
	 * Get all bookmarks
	 * @return {Observable} Observable bookmark array
	 */
	public getBookmarks(): Observable<Array<Bookmark>> {

		return this.http

			// Get data from API
			// TODO: Switch that to the REST API route, get base from some config service
			.get( 'bookmark.temp.json' )

			// Convert data
			.map( ( response: Response ) => <Bookmark[]> response.json().data )

			// Catch errors
			.catch( ( error: Response ) => {

				// Throw error
				// TODO: Call some kind of exception / error handling service
				// For example switch for status code and error message
				return Observable.throw( error );

			} );

	}

}
