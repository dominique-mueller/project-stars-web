/**
 * External imports
 */
import { Action, ActionReducer } from '@ngrx/store';
import { List, Map, fromJS } from 'immutable';

/**
 * Internal imports
 */
import { Bookmark } from './bookmark.model';

/**
 * Action constants
 */
export const LOAD_BOOKMARKS: string = 'LOAD_BOOKMARKS';
export const ADD_BOOKMARK: string = 'ADD_BOOKMARK';
export const UPDATE_BOOKMARK: string = 'UPDATE_BOOKMARK';
export const UPDATE_BOOKMARKS_UNASSIGN_LABEL: string = 'UPDATE_BOOKMARKS_UNASSIGN_LABEL';
export const DELETE_BOOKMARK: string = 'DELETE_BOOKMARK';
export const DELETE_FOLDER_BOOKMARKS: string = 'DELETE_FOLDER_BOOKMARKS';

/**
 * Initial state of the bookmark data (empty per default)
 */
const initialState: List<Bookmark> = List<Bookmark>();
const initialBookmarkState: Bookmark = <Bookmark> Map<string, any>( {
	created: null,
	description: '',
	favicon: null,
	id: null,
	labels: List<string>(),
	path: null,
	position: null,
	title: '',
	updated: null,
	url: ''
} );

/**
 * Bookmark store (reducer)
 */
export const bookmarkReducer: ActionReducer<List<Bookmark>> =
	( state: List<Bookmark> = initialState, action: Action ) => {

	switch ( action.type ) {

		// Load bookmarks (overwriting all state to default)
		case LOAD_BOOKMARKS:

			// Compute new state from initial state (with multiple mutations, better performance)
			return initialState.withMutations( ( newState: List<Bookmark> ) => {

				// Set bookmarks as a list (because order is important)
				action.payload.forEach( ( bookmark: any ) => {
					newState.push( <Bookmark> initialBookmarkState.merge( fromJS( bookmark ) ) );
				} );

			} );

		// Add bookmark
		case ADD_BOOKMARK:

			// Push the bookmark to the list
			return <List<Bookmark>> state
				.push( <Bookmark> fromJS( action.payload.data ) );

		// Update bookmark (only direct attributes, not labels)
		// TODO: Implement position swapping
		case UPDATE_BOOKMARK:

			// Check whether path and position changed
			let hasPathChanged: boolean = action.payload.data.hasOwnProperty( 'path' );
			let hasPositionChanged: boolean = action.payload.data.hasOwnProperty( 'position' );

			// Calculate the new position if only the path changed
			if ( hasPathChanged && !hasPositionChanged ) {
				action.payload.data.position = ( state
					.filter( ( bookmark: Bookmark ) => {
						return bookmark.get( 'path' ) === action.payload.data.path;
					} )
					.size ) + 1; // New position is on +1
				hasPositionChanged = true;
			}

			// Save old bookmark position and path for later on
			let oldPosition: number;
			let oldPath: number;

			return <List<Bookmark>> state

				// Update the bookmark attributes, save old position and path for later
				.map( ( bookmark: Bookmark ) => {
					if ( bookmark.get( 'id' ) === action.payload.id ) {
						oldPosition = bookmark.get( 'position' );
						oldPath = bookmark.get( 'path' );
						return bookmark.merge( Map<string, any>( action.payload.data ) );
					} else {
						return bookmark;
					}
				} )

				// Update positions of other bookmarks in the same old folder
				.map( ( bookmark: Bookmark ) => {

					// Only update positions if necessary and in the same old folder
					if ( hasPositionChanged && bookmark.get( 'path' ) === oldPath && bookmark.get( 'position' ) > oldPosition ) {
						return bookmark.set( 'position', bookmark.get( 'position' ) - 1 ); // Move one up
					} else {
						return bookmark;
					}

				} );

		// Unassign a label from all bookmarks this label is currently assigned to
		case UPDATE_BOOKMARKS_UNASSIGN_LABEL:

			// Delete label ID out of the label list of each bookmark (if it exists)
			return <List<Bookmark>> state
				.map( ( bookmark: Bookmark ) => {
					let labelPosition: number = bookmark.get( 'labels' ).indexOf( action.payload.labelId );
					if ( labelPosition > -1 ) {
						return bookmark.deleteIn( [ 'labels', labelPosition ] );
					} else {
						return bookmark;
					}
				} );

		// Delete bookmark, update position for all the other bookmarks
		case DELETE_BOOKMARK:

			// Save temporary values of the deleted bookmark
			let removedPosition: number;
			let folderPathId: string;

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
