/**
 * File: Label store
 */

import { Action, ActionReducer } from '@ngrx/store';
import { Map, fromJS } from 'immutable';

import { Label } from './label.model';

/**
 * Action constants
 */
export const LOAD_LABELS: string = 'LOAD_LABELS';
export const UNLOAD_LABELS: string = 'UNLOAD_LABELS';
export const UPDATE_LABEL: string = 'UPDATE_LABEL';
export const DELETE_LABEL: string = 'DELETE_LABEL';
export const ADD_LABEL: string = 'ADD_LABEL';

/**
 * Initial state of the label data (empty per default)
 */
const initialState: Map<string, Label> = Map<string, Label>();
const initialLabelState: Label = <Label> Map<string, any>( {
	color: '',
	id: null,
	name: ''
} );

/**
 * Label store (reducer)
 */
export const labelReducer: ActionReducer<Map<string, Label>> =
	(state: Map<string, Label> = initialState, action: Action) => {

	switch ( action.type ) {

		// Load all labels (overwrites the previous state)
		case LOAD_LABELS:
			return initialState.withMutations( ( newState: Map<string, Label> ) => {
				action.payload.forEach( ( label: any ) => {
					newState.set( label.id, <Label> initialLabelState.merge( fromJS( label ) ) );
				} );
			} );

		// Unload all labels / reset
		case UNLOAD_LABELS:
			return initialState;

		// Add a label
		case ADD_LABEL:
			return <Map<string, Label>> state
				.set( action.payload.data.id, <Label> initialLabelState.merge( fromJS( action.payload.data ) ) );

		// Update a label
		case UPDATE_LABEL:
			return <Map<string, Label>> state
				.map( ( label: Label ) => {
					if ( label.get( 'id' ) === action.payload.id ) {
						return label.merge( Map<string, any>( action.payload.data ) );
					} else {
						return label;
					}
				} );

		// Delete a label
		case DELETE_LABEL:
			return <Map<string, Label>> state
				.filterNot( ( label: Label ) => {
					return label.get( 'id' ) === action.payload.id;
				} );

		// Default fallback
		default:
			return state;

	}

};
