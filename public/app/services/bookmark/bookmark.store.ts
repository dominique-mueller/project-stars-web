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
export const DELETE_BOOKMARK: string = 'DELETE_BOOKMARK';
export const DELETE_FOLDER_BOOKMARKS: string = 'DELETE_FOLDER_BOOKMARKS';
// export const ADD_BOOKMARK: string = 'ADD_BOOKMARK';

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
			return <List<Bookmark>> state
				.map( ( bookmark: Bookmark ) => {
					if ( bookmark.get( 'id' ) === action.payload.id ) {
						return bookmark.merge( Map<string, any>( action.payload.data ) );
					} else {
						return bookmark;
					}
				} );

		// Delete bookmark, update position for all the other bookmarks
		case DELETE_BOOKMARK:

			// Save temporary values of the deleted bookmark
			let removedPosition: number;
			let folderPathId: number;

			return <List<Bookmark>> state

				// Filter the deleted bookmark out of the list, save its position
				.filterNot( ( bookmark: Bookmark ) => {
					if ( bookmark.get( 'id' ) === action.payload.id ) {
						removedPosition = bookmark.get( 'position' );
						folderPathId = bookmark.get( 'path' );
						return true;
					} else {
						return false;
					}
				} )

				// Update positions of bookmarks living in the same folder (if necessary)
				.map( ( bookmark: Bookmark ) => {
					if ( bookmark.get( 'path' ) === folderPathId && bookmark.get( 'position' ) > removedPosition ) {
						return bookmark.set( 'position', bookmark.get( 'position' ) - 1 );
					} else {
						return bookmark;
					}
				} );

		// Delete all bookmarks of folders
		case DELETE_FOLDER_BOOKMARKS:

			return <List<Bookmark>> state

				// Filter all bookmarks living inside the folders
				.filterNot( ( bookmark: Bookmark ) => {
					return action.payload.folderIds.indexOf( bookmark.get( 'path' ) ) > -1;
				} );

		// Default fallback
		default:
			return state;

	}

};
