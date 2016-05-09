/**
 * External imports
 */
import { Reducer, Action } from '@ngrx/store';
import { List, Map, fromJS } from 'immutable';

/**
 * Internal imports
 */
import { Bookmark } from './bookmark.model';

/**
 * Action constants
 */
export const LOAD_BOOKMARKS: string = 'LOAD_BOOKMARKS';
export const UPDATE_BOOKMARK: string = 'UPDATE_BOOKMARK';
// export const ADD_BOOKMARK: string = 'ADD_BOOKMARK';
// export const DELETE_BOOKMARK: string = 'DELETE_BOOKMARK';

/**
 * Initial state of the bookmark data (empty per default)
 */
const initialState: List<Bookmark> = List<Bookmark>();

/**
 * Bookmark store (reducer)
 */
export const bookmarks: Reducer<List<Bookmark>> = ( state: List<Bookmark> = initialState, action: Action ) => {

	switch ( action.type ) {

		// Load bookmarks (overwriting all state to default)
		case LOAD_BOOKMARKS:

			// Compute new state from initial state (with multiple mutations, better performance)
			return initialState.withMutations( ( newState: List<Bookmark> ) => {

				// Set bookmarks as a list (because order is important)
				action.payload.forEach( ( bookmark: any ) => {
					newState.push( fromJS( bookmark ) );
				} );

			} );

		// Update bookmark
		case UPDATE_BOOKMARK:

			// Update only the changed values
			return <List<Bookmark>> state.map( ( bookmark: Bookmark ) => {
				return ( bookmark.get( 'id' ) === action.payload.id )
					? bookmark.merge( Map<string, any>( action.payload.data ) )
					: bookmark;
			} );

		// Default fallback
		default:
			return state;

	}

};
