/**
 * File: Label data service
 */

import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { AuthHttp } from 'angular2-jwt';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { Store, Action } from '@ngrx/store';
import { Map } from 'immutable';

import { AppStore, AppService } from './../app';
import { BookmarkDataService } from './../bookmark';
import { Label } from './label.model';
import {
	LOAD_LABELS,
	UNLOAD_LABELS,
	ADD_LABEL,
	UPDATE_LABEL,
	DELETE_LABEL
} from './label.store';

/**
 * Label data service
 */
@Injectable()
export class LabelDataService {

	/**
	 * Observable map of all labels
	 */
	public labels: Observable<Map<string, Label>>;

	/**
	 * Authenticated HTTP service
	 */
	private authHttp: AuthHttp;

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
	 * @param {AuthHttp}            authHttp            Authenticated HTTP service
	 * @param {AppService}          appService          App service
	 * @param {Store<AppStore>}     store               App store
	 * @param {BookmarkDataService} bookmarkDataService Bookmark data service
	 */
	constructor(
		authHttp: AuthHttp,
		appService: AppService,
		store: Store<AppStore>,
		bookmarkDataService: BookmarkDataService
	) {

		// Initialize
		this.authHttp = authHttp;
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
			this.authHttp
				.get( `${ this.appService.API_URL }/labels` )
				.map( ( response: Response ) => response.status !== 204 ? response.json().data : null )
				.subscribe(
					( data: any ) => {
						this.store.dispatch( {
							payload: data,
							type: LOAD_LABELS
						} );
						console.log( 'APP > Label Data Service > Labels successfully loaded.' );
						resolve();
					},
					( error: any ) => {
						console.log( 'APP > Label Data Service > Error while loading labels.' );
						console.log( error );
						reject();
					}
				);
		} );
	}

	/**
	 * Unload labels
	 */
	public unloadLabels(): void {
		this.store.dispatch( {
			type: UNLOAD_LABELS
		} );
	}

	/**
	 * API request: Add a label
	 * @param  {any}          newLabelData New label data
	 * @return {Promise<any>}              Promise when done
	 */
	public addLabel( newLabelData: any ): Promise<any> {
		return new Promise<any>( ( resolve: Function, reject: Function ) => {
			this.authHttp
				.post( `${ this.appService.API_URL }/labels`, JSON.stringify( {
					data: newLabelData
				} ) )
				.map( ( response: Response ) => response.status !== 204 ? response.json().data : null )
				.subscribe(
					( data: any ) => {
						newLabelData.id = data.id;
						this.store.dispatch( {
							payload: {
								data: newLabelData
							},
							type: ADD_LABEL
						} );
						console.log( 'APP > Label Data Service > Label successfully added.' );
						resolve();
					},
					( error: any ) => {
						console.log( 'APP > Label Data Service > Error while adding a label.' );
						console.log( error );
						reject();
					}
				);
		} );
	}

	/**
	 * API request: Update a label
	 * @param  {string}       labelId      Label ID
	 * @param  {any}          updatedLabel Updated label data
	 * @return {Promise<any>}              Promise when done
	 */
	public updateLabel( labelId: string, updatedLabel: any ): Promise<any> {
		return new Promise<any>( ( resolve: Function, reject: Function ) => {
			this.authHttp
				.put( `${ this.appService.API_URL }/labels/${ labelId }`, JSON.stringify( {
					data: updatedLabel
				} ) )
				.map( ( response: Response ) => response.status !== 204 ? response.json().data : null )
				.subscribe(
					( data: any ) => {
						this.store.dispatch( {
							payload: {
								data: updatedLabel,
								id: labelId
							},
							type: UPDATE_LABEL
						} );
						console.log( 'APP > Label Data Service > Label successfully updated.' );
						resolve();
					},
					( error: any ) => {
						console.log( 'APP > Label Data Service > Error while updating a label.' );
						console.log( error );
						reject();
					}
				);
		} );
	}

	/**
	 * API request: Delete a label
	 * @param  {string}       labelId Label ID
	 * @return {Promise<any>}         Promise when done
	 */
	public deleteLabel( labelId: string ): Promise<any> {
		return new Promise<any>( ( resolve: Function, reject: Function ) => {
			this.authHttp
				.delete( `${ this.appService.API_URL }/labels/${ labelId }` )
				.map( ( response: Response ) => response.status !== 204 ? response.json() : null )
				.subscribe(
					( data: any ) => {
						this.store.dispatch( {
							payload: {
								id: labelId
							},
							type: DELETE_LABEL
						} );

						// Also unassign this label from all bookmarks
						this.bookmarkDataService.unassignLabelFromAllBookmarks( labelId );

						console.log( 'APP > Label Data Service > Label successfully deleted.' );
						resolve();
					},
					( error: any ) => {
						console.log( 'APP > Label Data Service > Error while deleting a label.' );
						console.log( error );
						reject();
					}
				);
		} );
	}

	/**
	 * Get label template, used as a basis when creating a new label
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
