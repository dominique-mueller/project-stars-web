/**
 * External imports
 */
import { Reducer, Action } from '@ngrx/store';
import { Map } from 'immutable';

/**
 * Action constants
 */
export const SET_OPENED_FOLDER_ID: string = 'SET_OPENED_FOLDER_ID';
export const SET_SELECTED_ELEMENT: string = 'SET_SELECTED_ELEMENT';
export const UNSET_SELECTED_ELEMENT: string = 'UNSET_SELECTED_ELEMENT';

/**
 * Initial state
 */
const initialState: Map<string, any> = Map( {
	openedFolderId: null,
	search: null,
	selectedElement: null
} );

/**
 * UI state (reducer)
 */
export const ui: Reducer<Map<string, any>> = ( state: Map<string, any> = initialState, action: Action ) => {

	switch ( action.type ) {

		// Set current folder (update)
		case SET_OPENED_FOLDER_ID:
			return state.set( 'openedFolderId', action.payload );

		// Set selected element (update)
		case SET_SELECTED_ELEMENT:
			return state.set( 'selectedElement', Map<string, any>( action.payload ) );

		// Unset selected element (reset)
		case UNSET_SELECTED_ELEMENT:
			return state.set( 'selectedElement', null );

		// Default fallback
		default:
			return state;

	}

};
