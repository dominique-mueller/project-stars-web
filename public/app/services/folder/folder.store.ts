/**
 * External imports
 */
import { Reducer, Action } from '@ngrx/store';

/**
 * Internal imports
 */
import { IFolder } from './folder.model';

/**
 * Action constants
 */
export const ADD_FOLDERS: string = 'ADD_FOLDERS';

/**
 * Folder store (reducer)
 */
export const folders: Reducer<IFolder[]> = ( state: IFolder[] = [], action: Action ) => {

	switch ( action.type ) {

		// Add folders
		case ADD_FOLDERS:
			return action.payload;

		// Default
		default:
			return state;

	}

};
