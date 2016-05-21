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
export const SET_SEARCH: string = 'SET_SEARCH';
export const RESET_SEARCH: string = 'RESET_SEARCH';

/**
 * Initial state
 */
const initialState: Map<string, any> = Map( {
	openedFolderId: 0,
	search: Map( {
		text: ''
	} ),
	selectedElement: Map( {
		id: null,
		type: null
	} )
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
			return state.withMutations( ( newState: Map<string, any> ) => {
				newState.setIn( [ 'selectedElement', 'id' ], action.payload[ 'id' ] )
						.setIn( [ 'selectedElement', 'type' ], action.payload[ 'type' ] );
			} );

		// Unset selected element (reset)
		case UNSET_SELECTED_ELEMENT:
			return state.withMutations( ( newState: Map<string, any> ) => {
				newState.setIn( [ 'selectedElement', 'id' ], null )
						.setIn( [ 'selectedElement', 'type' ], null );
			} );

		// Set search
		case SET_SEARCH:
			return state.setIn( [ 'search', 'text' ], action.payload.text );

		// Reset search
		case RESET_SEARCH:
			return state.setIn( [ 'search', 'text' ], '' );

		// Default fallback
		default:
			return state;

	}

};