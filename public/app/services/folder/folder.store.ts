/**
 * External imports
 */
import { Reducer, Action } from '@ngrx/store';
import { List, Map, fromJS } from 'immutable';

/**
 * Internal imports
 */
import { Folder } from './folder.model';

/**
 * Action constants
 */
export const LOAD_FOLDERS: string = 'LOAD_FOLDERS';
export const UPDATE_FOLDER: string = 'UPDATE_FOLDER';
export const DELETE_FOLDER: string = 'DELETE_FOLDER';
// export const ADD_FOLDER: string = 'ADD_FOLDER';

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

		// Update folder
		case UPDATE_FOLDER:

			// Update only the changed values
			return <List<Folder>> state
				.map( ( folder: Folder ) => {
					if ( folder.get( 'id' ) === action.payload.id ) {
						return folder.merge( Map<string, any>( action.payload.data ) );
					} else {
						return folder;
					}
				} );

		// Delete folder
		case DELETE_FOLDER:

			// Save temporary values of the deleted folder
			let removedPosition: number;
			let folderPathId: number;

			return <List<Folder>> state

				// Filter all deleted folders out of the list
				.filterNot( ( folder: Folder ) => {
					if ( folder.get( 'id' ) === action.payload.id ) {
						removedPosition = folder.get( 'position' );
						folderPathId = folder.get('path');
					}
					return action.payload.subfolderIds.indexOf( folder.get( 'id' ) ) > -1;

				} )

				// Update positions of other folders living at the same level (if necessary)
				.map( ( folder: Folder ) => {
					if ( folder.get( 'path' ) === folderPathId && folder.get( 'position' ) > removedPosition ) {
						return folder.set( 'position', folder.get( 'position' ) - 1 );
					} else {
						return folder;
					}
				} );

		// Default fallback
		default:
			return state;

	}

};
