/**
 * External imports
 */
import { Pipe, PipeTransform } from '@angular/core';
import { List } from 'immutable';

/**
 * Internal imports
 */
import { Bookmark } from './../services/bookmark';

/**
 * Pipe for filtering (aka searching in) bookmarks (pure function)
 */
@Pipe( {
	name: 'appFilterBookmarks',
	pure: true
} )
export class FilterBookmarksPipe implements PipeTransform {

	/**
	 * Pipe transform
	 * @param  {List<Bookmark>} value      List of bookmarks
	 * @param  {string}         filterText Filter text
	 * @return {List<Bookmark>}            Filtered list of bookmarks
	 */
	public transform( value: List<Bookmark>, filterText: string ): List<Bookmark> {

		// Skip if there are no data or search parameters (yet)
		if ( typeof value === 'undefined' || typeof filterText === 'undefined' ) {
			return value;
		}

		// Filter bookmarks
		// - Filter text must exist at least once in the title
		// - Filtering is not case-sensitive
		const optimizedFilterText: string = filterText.toLowerCase(); // To do it only once
		return <List<Bookmark>> value.filter( ( bookmark: Bookmark ) => {
			return bookmark.get( 'title' ).toLowerCase().indexOf( optimizedFilterText ) > -1;
		} );

	}

}
