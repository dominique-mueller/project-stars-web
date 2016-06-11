/**
 * File: Folder store
 */

import { Action, ActionReducer } from '@ngrx/store';
import { List, Map, fromJS } from 'immutable';

import { Folder } from './folder.model';

/**
 * Action constants
 */
export const LOAD_FOLDERS: string = 'LOAD_FOLDERS';
export const ADD_FOLDER: string = 'ADD_FOLDER';
export const UPDATE_FOLDER: string = 'UPDATE_FOLDER';
export const DELETE_FOLDER: string = 'DELETE_FOLDER';
export const DELETE_FOLDERS: string = 'DELETE_FOLDERS';

/**
 * Initial state of the folder data (empty per default)
 */
const initialState: List<Folder> = List<Folder>();
const initialFolderState: Folder = <Folder> Map<string, any>( {
	created: null,
	description: '',
	id: null,
	isRoot: false,
	name: null,
	path: null,
	position: null,
	updated: null
} );

/**
 * Folder store (reducer)
 */
export const folderReducer: ActionReducer<List<Folder>> =
	( state: List<Folder> = initialState, action: Action ) => {

	switch ( action.type ) {

		// Load all folders (overwrites the previous state)
		case LOAD_FOLDERS:
			return initialState.withMutations( ( newState: List<Folder> ) => {
				action.payload.forEach( ( folder: any ) => {
					newState.push( <Folder> initialFolderState.merge( fromJS( folder ) ) );
				} );
			} );

		// Add a folder
		case ADD_FOLDER:
			return <List<Folder>> state
				.push( <Folder> fromJS( action.payload.data ) );

		// Update a folder, update positions if necessary
		// TODO: Implement position swapping only
		case UPDATE_FOLDER:

			// Check whether path and position changed
			let hasPathChanged: boolean = action.payload.data.hasOwnProperty( 'path' );
			let hasPositionChanged: boolean = action.payload.data.hasOwnProperty( 'position' );

			// Calculate the new position if only the path changed
			if ( hasPathChanged && !hasPositionChanged ) {
				action.payload.data.position = ( state
					.filter( ( folder: Folder ) => {
						return folder.get( 'path' ) === action.payload.data.path;
					})
					.size) + 1; // New position is on +1
				hasPositionChanged = true;
			}

			// Save old folder position and path (for later)
			let oldPosition: number;
			let oldPath: string;

			return <List<Folder>> state

				// Update the folder attributes, save old position and path
				.map( ( folder: Folder ) => {
					if ( folder.get( 'id' ) === action.payload.id ) {
						oldPosition = folder.get( 'position' );
						oldPath = folder.get( 'path' );
						return folder.merge( Map<string, any>( action.payload.data ) );
					} else {
						return folder;
					}
				} )

				// Update positions of other folders in the same old folder (if necessary)
				.map( ( folder: Folder ) => {
					if ( hasPositionChanged && folder.get( 'path' ) === oldPath && folder.get( 'position' ) > oldPosition) {
						return folder.set( 'position', folder.get( 'position' ) - 1 ); // Move one up
					} else {
						return folder;
					}

				} );

		// Delete a folder, update positions if necessary
		case DELETE_FOLDER:

			// Save temporary values of the deleted folder
			let removedPosition: number;
			let folderPathId: string;

			return <List<Folder>> state

				// Filter all deleted folders out of the list
				.filter( ( folder: Folder ) => {
					if ( folder.get( 'id' ) === action.payload.id ) {
						removedPosition = folder.get( 'position' );
						folderPathId = folder.get( 'path' );
						return false;
					} else {
						return true;
					}

				} )

				// Update positions of other folders living at the same level (if necessary)
				.map( ( folder: Folder ) => {
					if ( folder.get( 'path' ) === folderPathId && folder.get( 'position' ) > removedPosition ) {
						return folder.set( 'position', folder.get( 'position' ) - 1 );
					} else {
						return folder;
					}
				} );

		// Delete multiple folders, this does not swap positions or similar
		// Sidenote: This is used in combination with deleting a single folder
		case DELETE_FOLDERS:
			return <List<Folder>> state
				.filter( ( folder: Folder ) => {
					if ( action.payload.folderIds.indexOf( folder.get( 'id' ) ) === -1 ) {
						return true;
					} else {
						return false;
					}
				} );

		// Default fallback
		default:
			return state;

	}

};
