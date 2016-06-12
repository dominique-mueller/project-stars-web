/**
 * File: Label logic service
 */

import { Injectable } from '@angular/core';
import { Map, Iterable } from 'immutable';

import { Label } from './label.model';
import { Bookmark } from './../bookmark';

/**
 * Label logic service
 */
@Injectable()
export class LabelLogicService {

	/**
	 * Filter labels that are currently not assigned to a provided bookmark (pure function)
	 * @param  {Map<string, Label>} labels   Map of all labels
	 * @param  {Bookmark}           bookmark Bookmark
	 * @return {Map<string, Label>}          Map of all unassigned labels
	 */
	public getUnassignedLabelsByBookmark( labels: Map<string, Label>, bookmark: Bookmark ): Map<string, Label> {
		return <Map<string, Label>> labels.filter( ( label: Label ) => {
			return bookmark.get( 'labels' ).indexOf( label.get( 'id' ) ) === -1;
		} );
	}

}
