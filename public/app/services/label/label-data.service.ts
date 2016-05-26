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
import {
	LOAD_LABELS,
	ADD_LABEL,
	UPDATE_LABEL,
	DELETE_LABEL
} from './label.store';

/**
 * Label data service
 * Contains functions for loading, creating, updating or deleting label data (on the server)
 */
@Injectable()
export class LabelDataService {

	/**
	 * Observable map of labels
	 */
	public labels: Observable<Map<string, Label>>;

	/**
	 * HTTP service
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
	 * Bookmark data service
	 */
	private bookmarkDataService: BookmarkDataService;

	/**
	 * Constructor
	 */
	constructor(
		http: Http,
		appService: AppService,
		store: Store<AppStore>,
		bookmarkDataService: BookmarkDataService
	) {

		// Initialize
		this.http = http;
		this.appService = appService;
		this.store = store;
		this.bookmarkDataService = bookmarkDataService;

		// Setup
		this.labels = <Observable<Map<string, Label>>> store.select('labels'); // Select returns an observable

	}

	/**
	 * API request: Load all labels
	 * @return {Promise<any>} Promise when done
	 */
	public loadLabels(): Promise<any> {

		return new Promise<any>( ( resolve: Function, reject: Function ) => {
			setTimeout(
				() => {

					this.http

						// Fetch data and parse response
						.get( `${ this.appService.API_URL }/labels.mock.json` )
						.map( ( response: Response ) => <any> response.json() )

						// Dispatch action
						.subscribe(
							( data: any ) => {
								this.store.dispatch( {
									payload: data.data,
									type: LOAD_LABELS
								} );
								console.log( 'APP > Labels Data Service > Labels successfully loaded from the API.' );
								resolve();
							},
							( error: any ) => {
								console.log( 'APP > Label Data Service > Error while loading labels.' );
								console.log( error );
								reject();
							}
						);

				},
				Math.floor( Math.random() * 3000 ) + 1
			);
		} );

		/* TODO: This is the production code

		return new Promise<any>( ( resolve: Function, reject: Function ) => {
			this.http

				// Fetch data and parse response
				.get( `${ this.appService.API_URL }/labels` )
				.map( ( response: Response ) => <any> response.json() )

				// Dispatch action
				.subscribe(
					( data: any ) => {
						this.store.dispatch( {
							payload: data.data,
							type: LOAD_LABELS
						} );
						console.log( 'APP > Labels Data Service > Labels successfully loaded from the API.' );
						resolve();
					},
					( error: any ) => {
						console.log( 'APP > Label Data Service > Error while loading labels.' );
						console.log( error );
						reject();
					}
				);
		} );

		*/

	}

	/**
	 * API request: Add a new label
	 * @param  {any}          newLabel Data of the new label
	 * @return {Promise<any>}          Promise when done
	 */
	public addLabel( newLabel: any ): Promise<any> {

		return new Promise<any>( ( resolve: Function, reject: Function ) => {
			setTimeout(
				() => {
					newLabel.id = `LAB${ Math.floor( Math.random() * 11 ) }`;
					this.store.dispatch( {
						payload: {
							data: newLabel
						},
						type: ADD_LABEL
					} );
					console.log( 'APP > Labels Data Service > New label successfully added.' );
					resolve();
				},
				Math.floor( Math.random() * 3000 ) + 1
			);
		} );

		/* TODO: This is the production code

		return new Promise<any>( ( resolve: Function, reject: Function ) => {
			this.http

				// Send data and parse response
				.post( `${ this.appService.API_URL }/labels`, JSON.stringify( { data: newLabel } ) )
				.map( ( response: Response ) => <any> response.json() )

				// Dispatch action
				.subscribe(
					( data: any ) => {
						newLabel.id = data.data.id;
						this.store.dispatch( {
							payload: {
								data: newLabel
							},
							type: ADD_LABEL
						} );
						console.log( 'APP > Labels Data Service > New label successfully added.' );
						resolve();
					},
					( error: any ) => {
						console.log( 'APP > Label Data Service > Error while adding a new label.' );
						console.log( error );
						reject();
					}
				);
		} );

		*/

	}

	/**
	 * API request: Update an existing label
	 * @param  {string}       labelId      Label ID
	 * @param  {any}          updatedLabel Updated label data
	 * @return {Promise<any>}              Promise when done
	 */
	public updateLabel( labelId: string, updatedLabel: any ): Promise<any> {

		return new Promise<any>( ( resolve: Function, reject: Function ) => {
			setTimeout(
				() => {
					this.store.dispatch( {
						payload: {
							data: updatedLabel,
							id: labelId
						},
						type: UPDATE_LABEL
					} );
					console.log( 'APP > Labels Data Service > Label successfully updated.' );
					resolve();
				},
				Math.floor( Math.random() * 3000 ) + 1
			);
		} );

		/* TODO: This is the production code

		return new Promise<any>( ( resolve: Function, reject: Function ) => {
			this.http

				// Send data and parse response
				.put( `${ this.appService.API_URL }/labels/${ labelId }`, JSON.stringify( { data: updatedLabel } ) )
				.map( ( response: Response ) => <any> response.json() )

				// Dispatch action
				.subscribe(
					( data: any ) => {
						this.store.dispatch( {
							payload: {
								data: updatedLabel,
								id: labelId
							},
							type: UPDATE_LABEL
						} );
						console.log( 'APP > Labels Data Service > Label successfully updated.' );
						resolve();
					},
					( error: any ) => {
						console.log( 'APP > Label Data Service > Error while updating a label.' );
						console.log( error );
						reject();
					}
				);
		} );

		*/

	}

	/**
	 * API request: Delete an existing bookmark
	 * @param  {string}       labelId Label ID
	 * @return {Promise<any>}         Promise when done
	 */
	public deleteLabel( labelId: string ): Promise<any> {

		return new Promise<any>( ( resolve: Function, reject: Function ) => {
			setTimeout(
				() => {

					// Delete this label
					this.store.dispatch( {
						payload: {
							id: labelId
						},
						type: DELETE_LABEL
					} );

					// Also unassign this label from all bookmarks
					this.bookmarkDataService.unassignLabelFromAllBookmarks( labelId );
					console.log( 'APP > Labels Data Service > Label successfully deleted.' );
					resolve();

				},
				Math.floor( Math.random() * 3000 ) + 1
			);
		} );

		/* TODO: This is the production code

		return new Promise<any>( ( resolve: Function, reject: Function ) => {
			this.http

				// Send data and parse response
				.delete( `${ this.appService.API_URL }/labels/${ labelId }` )
				.map( ( response: Response ) => <any> response.json() )

				// Dispatch action
				.subscribe(
					( data: any ) => {

						// Delete this label
						this.store.dispatch( {
							payload: {
								id: labelId
							},
							type: DELETE_LABEL
						} );

						// Also unassign this label from all bookmarks
						this.bookmarkDataService.unassignLabelFromAllBookmarks( labelId );
						console.log( 'APP > Labels Data Service > Label successfully deleted.' );
						resolve();

					},
					( error: any ) => {
						console.log( 'APP > Label Data Service > Error while deleting a label.' );
						console.log( error );
						reject();
					}
				);
		} );

		*/

	}

	/**
	 * Get label template, used when creating a new label
	 * @return {Label} Label template
	 */
	public getLabelTemplate(): Label {
		return <Label> Map<string, any>( {
			color: '#606060',
			id: null,
			name: 'Unnamed label'
		} );
	}

}
