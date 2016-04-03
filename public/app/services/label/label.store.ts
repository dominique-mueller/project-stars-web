/**
 * External imports
 */
import { Reducer, Action } from '@ngrx/store';
import { Map, fromJS } from 'immutable';

/**
 * Internal imports
 */
import { ILabel } from './label.model';

/**
 * Action constants
 */
export const LOAD_LABELS: string = 'LOAD_LABELS';
export const ADD_LABEL: string = 'ADD_LABEL';
export const UPDATE_LABEL: string = 'UPDATE_LABEL';
export const DELETE_LABEL: string = 'DELETE_LABEL';

/**
 * Initial state of the label data (empty per default)
 */
const initialState: Map<string, Map<string, any>> = Map<string, Map<string, any>>();

/**
 * Label store (reducer)
 */
export const labels: Reducer<Map<string, Map<string, any>>> =
	(state: Map<string, Map<string, any>> = initialState, action: Action) => {

	switch (action.type) {

		// Load labels (overwriting all state to default)
		case LOAD_LABELS:

			// Compute new state from initial state (with multiple mutations, better performance)
			return initialState.withMutations( ( map: Map<string, Map<string, any>> ) => {

				// Set labels as a map (for easier access later on)
				action.payload.forEach( ( item: any ) => {
					map.set( item.id, fromJS( item ) );
				} );

			} );

		// Default fallback
		default:
			return state;

	}

};
