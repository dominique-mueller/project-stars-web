/**
 * External imports
 */
import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { Map } from 'immutable';

/**
 * Internal imports
 */
import { AppStore, AppService } from './../app';
import {
	SET_OPENED_FOLDER_ID,
	SET_SELECTED_ELEMENT,
	UNSET_SELECTED_ELEMENT,
	SET_SEARCH,
	RESET_SEARCH
} from './ui.store';

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
	 * Title service
	 */
	private titleService: Title;

	/**
	 * App service
	 */
	private appService: AppService;

	/**
	 * Constructor
	 */
	constructor(
		store: Store<AppStore>,
		titleService: Title,
		appService: AppService
	) {

		// Initialize
		this.store = store;
		this.titleService = titleService;
		this.appService = appService;

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
	 * @param {string} elementType Element type
	 * @param {number} elementId   ELement ID
	 */
	public setSelectedElement( elementType: string, elementId: number ): void {
		this.store.dispatch( {
			payload: {
				id: elementId,
				type: elementType
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

	/**
	 * Set search
	 */
	public setSearch( text: string ): void {
		this.store.dispatch( {
			payload: {
				text: text
			},
			type: SET_SEARCH
		} );
	}

	/**
	 * Reset search
	 */
	public resetSearch(): void {
		this.store.dispatch( {
			type: RESET_SEARCH
		} );
	}

	/**
	 * Set document title
	 * This will be visible in the browser tab / window, as well as in the history stack and bookmarks
	 * @param {string} title Document title
	 */
	public setDocumentTitle( title: string ): void {
		this.titleService.setTitle( `${ title } ‒ ${ this.appService.APP_NAME }` );
	}

}
