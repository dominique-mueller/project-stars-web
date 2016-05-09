/**
 * External imports
 */
import { Reducer, Action } from '@ngrx/store';
import { Map, fromJS } from 'immutable';

/**
 * Internal imports
 */
import { Label } from './label.model';

/**
 * Action constants
 */
export const LOAD_LABELS: string = 'LOAD_LABELS';
// export const ADD_LABEL: string = 'ADD_LABEL';
// export const UPDATE_LABEL: string = 'UPDATE_LABEL';
// export const DELETE_LABEL: string = 'DELETE_LABEL';

/**
 * Initial state of the label data (empty per default)
 */
const initialState: Map<string, Label> = Map<string, Label>();

/**
 * Label store (reducer)
 */
export const labels: Reducer<Map<string, Label>> = ( state: Map<string, Label> = initialState, action: Action ) => {

	switch ( action.type ) {

		// Load labels (overwriting all state to default)
		case LOAD_LABELS:

			// Compute new state from initial state (with multiple mutations, better performance)
			return initialState.withMutations( ( newState: Map<string, Label> ) => {

				// Set labels as a map (for easier access later on)
				action.payload.forEach( ( label: any ) => {
					newState.set( label.id, fromJS( label ) );
				} );

			} );

		// Default fallback
		default:
			return state;

	}

};
