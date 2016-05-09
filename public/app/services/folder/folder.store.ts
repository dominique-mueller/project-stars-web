/**
 * External imports
 */
import { Reducer, Action } from '@ngrx/store';
import { List, fromJS } from 'immutable';

/**
 * Internal imports
 */
import { Folder } from './folder.model';

/**
 * Action constants
 */
export const LOAD_FOLDERS: string = 'LOAD_FOLDERS';
// export const ADD_FOLDER: string = 'ADD_FOLDER';
// export const UPDATE_FOLDER: string = 'UPDATE_FOLDER';
// export const DELETE_FOLDER: string = 'DELETE_FOLDER';

/**
 * Initial state of the folder data (empty per default)
 */
const initialState: List<Folder> = List<Folder>();

/**
 * Folder store (reducer)
 */
export const folders: Reducer<List<Folder>> = ( state: List<Folder> = initialState, action: Action ) => {

	switch ( action.type ) {

		// Load folders (overwriting all state to default)
		case LOAD_FOLDERS:

			// Compute new state from initial state (with multiple mutations, better performance)
			return initialState.withMutations( ( newState: List<Folder> ) => {

				// Set folders as a list (because order is important)
				action.payload.forEach( ( folder: any ) => {
					newState.push( fromJS( folder ) );
				} );

			} );

		// Default fallback
		default:
			return state;

	}

};
