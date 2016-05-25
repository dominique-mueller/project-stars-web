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
	 */
	public loadLabels(): void {

		// TODO: This is only the dev text code, real code follows up
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
						}
					);

			},
			1000
		);

		/* TODO: This is the production code

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
				},
				( error: any ) => {
					// TODO: Proper error handling
					console.error( 'LABEL SERVICE ERROR' );
					console.dir( error );
				}
			);

		*/

	}

	/**
	 * API request: Add a new label
	 * @param {any} newLabel Data of the new label
	 */
	public addLabel( newLabel: any ): void {

		// TODO: This is only the dev text code, real code follows up
		setTimeout(
			() => {
				newLabel.id = `LAB${ Math.floor( Math.random() * 11 ) }`;
				this.store.dispatch( {
					payload: {
						data: newLabel
					},
					type: ADD_LABEL
				} );
			},
			1000
		);

		/* TODO: This is the production code

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
				},
				( error: any ) => {
					// TODO: Proper error handling
					console.error( 'LABEL SERVICE ERROR' );
					console.dir( error );
				}
			);

		*/

	}

	/**
	 * API request: Update an existing label
	 * @param {string} labelId      Label ID
	 * @param {any}    updatedLabel Updated label data
	 */
	public updateLabel( labelId: string, updatedLabel: any ): void {

		// TODO: This is only the dev text code, real code follows up
		setTimeout(
			() => {
				this.store.dispatch( {
					payload: {
						data: updatedLabel,
						id: labelId
					},
					type: UPDATE_LABEL
				} );
			},
			1000
		);

		/* TODO: This is the production code

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
				},
				( error: any ) => {
					// TODO: Proper error handling
					console.error( 'LABEL SERVICE ERROR' );
					console.dir( error );
				}
			);

		*/

	}

	/**
	 * API request: Delete an existing bookmark
	 * @param {string} labelId Label ID
	 */
	public deleteLabel( labelId: string ): void {

		// TODO: This is only the dev text code, real code follows up
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

			},
			1000
		);

		/* TODO: This is the production code

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
					this.bookmarkDataService.unassignLabelFromAllBookmarks(labelId);

				},
				( error: any ) => {
					// TODO: Proper error handling
					console.error( 'LABEL SERVICE ERROR' );
					console.dir( error );
				}
			);

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
