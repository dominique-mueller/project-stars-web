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
	 * Filter labels: Get all labels that are currently not assigned to a provided bookmark
	 * @param  {Iterable<string, Label>} labels   Map of all labels
	 * @param  {Bookmark}                bookmark Bookmark
	 * @return {Iterable<string, Label>}          Map of all unassigned labels
	 */
	public getUnassignedLabelsByBookmark( labels: Map<number, Label>, bookmark: Bookmark ): Map<number, Label> {

		// Filter: Get all unassigned labels
		return <Map<number, Label>> labels.filter( ( label: Label ) => {
			return bookmark.get( 'labels' ).indexOf( label.get( 'id' ) ) === -1;
		} );

	}

}
