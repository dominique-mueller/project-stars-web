/**
 * External imports
 */
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { Store, Action } from '@ngrx/store';
import { Map } from 'immutable';

/**
 * Internal imports
 */
import { AppStore, AppService } from './../app';
import { BookmarkDataService } from './../bookmark';
import { Label } from './label.model';
import { LOAD_LABELS, ADD_LABEL, UPDATE_LABEL, DELETE_LABEL } from './label.store';

/**
 * Label data service
 * Contains functions for loading, creating, updating or deleting label data (on the server)
 */
@Injectable()
export class LabelDataService {

	/**
	 * Observable map of labels
	 */
	public labels: Observable<Map<number, Label>>;

	/**
	 * Status flag representing the current fetching status
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
	 * Bookmark data service
	 */
	private bookmarkDataService: BookmarkDataService;

	/**
	 * App store
	 */
	private store: Store<AppStore>;

	/**
	 * Constructor
	 */
	constructor( http: Http, appService: AppService, bookmarkDataService: BookmarkDataService, store: Store<AppStore> ) {

		// Initialize services
		this.http = http;
		this.appService = appService;
		this.bookmarkDataService = bookmarkDataService;
		this.store = store;

		// Setup
		this.labels = store.select( 'labels' ); // Select returns an observable
		this.isFetching = false;

	}

	/**
	 * Load all labels from the server
	 */
	public loadLabels(): void {

		// Fetch data from server
		this.isFetching = true;
		this.http.get( `${ this.appService.API_URL }/labels.mock.json` ) // TODO: Change to REST API

			// Convert data
			.map( ( response: Response ) => <Array<any>> response.json().data )

			// Create action
			.map( ( payload: Array<any> ) => ( { type: LOAD_LABELS, payload } ) )

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
	 * Add a new label
	 * @param {any} data Data
	 */
	public addLabel( data: any ): void {

		// TODO: API CALL
		let apiCallResultId: number = 20;
		data[ 'id' ] = apiCallResultId;

		// Dispatch action
		this.store.dispatch( {
			payload: {
				data: data,
				id: apiCallResultId
			},
			type: ADD_LABEL
		} );

	}

	/**
	 * Update label
	 * @param {number} labelId Label ID
	 * @param {any}    data    Data
	 */
	public updateLabel( labelId: number, data: any ): void {

		// TODO: API CALL

		// Dispatch action
		this.store.dispatch( {
			payload: {
				data: data,
				id: labelId
			},
			type: UPDATE_LABEL
		} );

	}

	/**
	 * Delete one label
	 * @param {number} labelId Label ID
	 */
	public deleteLabel( labelId: number ): void {

		// TODO: API CALL

		// Dispatch action
		this.store.dispatch( {
			payload: {
				id: labelId
			},
			type: DELETE_LABEL
		} );

		// Unassign this label from all bookmarks
		this.bookmarkDataService.unassignLabelFromAllBookmarks( labelId );

	}

	/**
	 * Get label template (for creating a new label)
	 * @return {Label} Label template
	 */
	public getLabelTemplate(): Label {
		return <Label> Map<string, any>( {
			color: '#606060',
			id: -1,
			name: ''
		} );
	}

}
