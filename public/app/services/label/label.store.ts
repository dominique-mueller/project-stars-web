/**
 * External imports
 */
import { Reducer, Action } from '@ngrx/store';

/**
 * Internal imports
 */
import { ILabel } from './label.model';

/**
 * Action constants
 */
export const ADD_LABELS: string = 'ADD_LABELS';

/**
 * Label store (reducer)
 */
export const labels: Reducer<ILabel[]> = (state: ILabel[] = [], action: Action) => {

	switch (action.type) {

		// Add folders
		case ADD_LABELS:
			return action.payload;

		// Default
		default:
			return state;

	}

};
