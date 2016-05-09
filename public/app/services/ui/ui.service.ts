/**
 * External imports
 */
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { Map } from 'immutable';

/**
 * Internal imports
 */
import { AppStore } from './../app';
import { SET_OPENED_FOLDER_ID, SET_SELECTED_ELEMENT, UNSET_SELECTED_ELEMENT } from './ui.store';

/**
 * Navigation service
 */
@Injectable()
export class UiService {

	/**
	 * UI state
	 */
	public uiState: Observable<Map<string, any>>;

	/**
	 * App store
	 */
	private store: Store<AppStore>;

	/**
	 * Constructor
	 */
	constructor( store: Store<AppStore> ) {

		// Initialize services
		this.store = store;

		// Setup
		this.uiState = this.store.select( 'ui' );

	}

	/**
	 * Set opened folder ID
	 * @param {number} folderId Folder
	 */
	public setOpenedFolderId( folderId: number ): void {
		this.store.dispatch( {
			payload: folderId,
			type: SET_OPENED_FOLDER_ID
		} );
	}

	/**
	 * Set the selected element
	 * @param {string} type Element type (folder / bookmark)
	 * @param {number} id   Element id
	 */
	public setSelectedElement( type: string, id: number ): void {
		this.store.dispatch( {
			payload: {
				id: id,
				type: type
			},
			type: SET_SELECTED_ELEMENT
		} );
	}

	/**
	 * Unset the selected element
	 */
	public unsetSelectedElement(): void {
		this.store.dispatch( {
			type: UNSET_SELECTED_ELEMENT
		} );
	}

}
