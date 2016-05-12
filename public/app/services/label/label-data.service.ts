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
import { Label } from './label.model';
import { LOAD_LABELS, UPDATE_LABEL, DELETE_LABEL } from './label.store';

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
	 * App store
	 */
	private store: Store<AppStore>;

	/**
	 * Constructor
	 */
	constructor( http: Http, appService: AppService, store: Store<AppStore> ) {

		// Initialize services
		this.http = http;
		this.appService = appService;
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

}
