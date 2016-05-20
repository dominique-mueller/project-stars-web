/**
 * External imports
 */
import { Reducer, Action } from '@ngrx/store';
import { Map, fromJS } from 'immutable';

/**
 * Internal imports
 */
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
	lastName: null,
	profileImage: null,
	registered: null
} );

/**
 * Bookmark store (reducer)
 */
export const user: Reducer<User> = ( state: User = initialState, action: Action ) => {

	switch ( action.type ) {

		// Load user (overwriting all state to default)
		case LOAD_USER:
			return <User> initialState.merge( fromJS( action.payload ) );

		// Default fallback
		default:
			return state;

	}

};
