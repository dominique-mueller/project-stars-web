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
export const UPDATE_LABEL: string = 'UPDATE_LABEL';
export const DELETE_LABEL: string = 'DELETE_LABEL';
export const ADD_LABEL: string = 'ADD_LABEL';

/**
 * Initial state of the label data (empty per default)
 */
const initialState: Map<number, Label> = Map<number, Label>();

/**
 * Label store (reducer)
 */
export const labels: Reducer<Map<number, Label>> = ( state: Map<number, Label> = initialState, action: Action ) => {

	switch ( action.type ) {

		// Load labels (overwriting all state to default)
		case LOAD_LABELS:

			// Compute new state from initial state (with multiple mutations, better performance)
			return initialState.withMutations( ( newState: Map<number, Label> ) => {

				// Set labels as a map (for easier access later on)
				action.payload.forEach( ( label: any ) => {
					newState.set( label.id, fromJS( label ) );
				} );

			} );

		// Add label
		case ADD_LABEL:

			// Set label in the correct state
			return <Map<number, Label>> state
				.set( action.payload.id, <Label> Map<string, any>( action.payload.data ) );

		// Update label
		case UPDATE_LABEL:

			// Update only the changed values
			return <Map<number, Label>> state
				.map( ( label: Label ) => {
					if ( label.get( 'id' ) === action.payload.id ) {
						return label.merge( Map<number, any>( action.payload.data ) );
					} else {
						return label;
					}
				} );

		// Delete label
		case DELETE_LABEL:

			// Filter the deleted label out of the list
			return <Map<number, Label>> state
				.filterNot( ( label: Label ) => {
					return label.get( 'id' ) === action.payload.id;
				} );

		// Default fallback
		default:
			return state;

	}

};
