/**
 * External imports
 */
import { Reducer, Action } from '@ngrx/store';

/**
 * Internal imports
 */
import { IBookmark } from './bookmark.model';

/**
 * Action constants
 */
export const ADD_BOOKMARKS: string = 'ADD_BOOKMARKS';

/**
 * Bookmark store (reducer)
 */
export const bookmarks: Reducer<IBookmark[]> = ( state: IBookmark[] = [], action: Action ) => {

	switch ( action.type ) {

		// Add bookmarks
		case ADD_BOOKMARKS:
			return action.payload;

		// Default
		default:
			return state;

	}

};
