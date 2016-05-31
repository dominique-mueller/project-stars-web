/**
 * External imports
 */
import { Injectable } from '@angular/core';
import { Map, Iterable } from 'immutable';

/**
 * Internal imports
 */
import { Label } from './label.model';
import { Bookmark } from './../bookmark';

/**
 * Label logic service
 * Contains pure functions for getting, filtering or manipulating label data
 */
@Injectable()
export class LabelLogicService {

	/**
	 * Filtering: Get all labels that are currently not assigned to a provided bookmark
	 * @param  {Map<string, Label>} labels   Map of all labels
	 * @param  {Bookmark}           bookmark Bookmark
	 * @return {Map<string, Label>}          Map of all unassigned labels
	 */
	public getUnassignedLabelsByBookmark( labels: Map<string, Label>, bookmark: Bookmark ): Map<string, Label> {

		// Filter: Get all unassigned labels
		return <Map<string, Label>> labels.filter( ( label: Label ) => {
			return bookmark.get( 'labels' ).indexOf( label.get( 'id' ) ) === -1;
		} );

	}

}
