/**
 * File: User store
 */

import { Action, ActionReducer } from '@ngrx/store';
import { Map, fromJS } from 'immutable';

import { User } from './user.model';

/**
 * Actions constants
 */
export const LOAD_USER: string = 'LOAD_USER';

/**
 * Initial state of the user data (empty per default)
 */
const initialState: User = <User> Map<string, any>( {
	emailAddress: null,
	firstName: null,
	id: null,
	lastName: null
} );

/**
 * Bookmark store (reducer)
 */
export const userReducer: ActionReducer<User> =
	( state: User = initialState, action: Action ) => {

	switch ( action.type ) {

		// Load user (overwrites the previous state)
		case LOAD_USER:
			return <User> initialState.merge( fromJS( action.payload ) );

		// Default fallback
		default:
			return state;

	}

};
