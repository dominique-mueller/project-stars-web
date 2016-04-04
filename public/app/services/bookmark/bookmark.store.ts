/**
 * External imports
 */
import { Reducer, Action } from '@ngrx/store';
import { List, Map, fromJS } from 'immutable';

/**
 * Internal imports
 */
import { IBookmark } from './bookmark.model';

/**
 * Action constants
 */
export const LOAD_BOOKMARKS: string = 'LOAD_BOOKMARKS';
export const ADD_BOOKMARK: string = 'ADD_BOOKMARK';
export const UPDATE_BOOKMARK: string = 'UPDATE_BOOKMARK';
export const DELETE_BOOKMARK: string = 'DELETE_BOOKMARK';

/**
 * Initial state of the bookmark data (empty per default)
 */
const initialState: List<Map<string, any>> = List<Map<string, any>>();

/**
 * Bookmark store (reducer)
 */
export const bookmarks: Reducer<List<Map<string, any>>> =
	( state: List<Map<string, any>> = initialState, action: Action ) => {

	switch ( action.type ) {

		// Load bookmarks (overwriting all state to default)
		case LOAD_BOOKMARKS:

			// Compute new state from initial state (with multiple mutations, better performance)
			return initialState.withMutations( ( list: List<Map<string, any>> ) => {

				// Set bookmarks as a list (because order is important)
				action.payload.forEach( ( item: any ) => {
					list.push( fromJS( item ) );
				} );

			} );

		// Update bookmark
		case UPDATE_BOOKMARK:

			// Update only the changed values
			return <List<Map<string, any>>> state.map( ( item: Map<string, any> ) => {
				return ( item.get( 'id' ) === action.payload.id ) ? item.merge( Map<string, any>( action.payload.data ) ) : item;
			} );

		// Default fallback
		default:
			return state;

	}

};
