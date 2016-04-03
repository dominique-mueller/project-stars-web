/**
 * External imports
 */
import { Injectable } from 'angular2/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';

/**
 * Internal imports
 */
import { IAppStore } from './../app/app.store';
import { SET_CURRENT_FOLDER, SET_SELECTED_ELEMENT, UNSET_SELECTED_ELEMENT } from './ui.store';

/**
 * Navigation service
 */
@Injectable()
export class UiService {

	public uiState: Observable<any>;

	/**
	 * App store
	 */
	private store: Store<IAppStore>;

	/**
	 * Constructor
	 * @param {Store<IAppStore>} store App store
	 */
	constructor( store: Store<IAppStore> ) {

		// Initialize services
		this.store = store;

		// Setup
		this.uiState = this.store.select( 'ui' );

	}

	/**
	 * Set opened folder
	 * @param {number} folder Folder
	 */
	public setOpenedFolder( folder: number ): void {
		this.store.dispatch( {
			payload: folder,
			type: SET_CURRENT_FOLDER
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
