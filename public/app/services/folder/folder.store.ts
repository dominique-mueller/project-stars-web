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
export const SELECT_FOLDER: string = 'SELECT_FOLDER';

/**
 * Folde store (reducer)
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

/**
 * Select folder store
 */
export const selectedFolder: Reducer<number> = ( state: number = 0, action: Action ) => {

	switch ( action.type ) {

		// Select folder
		case SELECT_FOLDER:
			return state;

		// Default
		default:
			return state;

	}

};
