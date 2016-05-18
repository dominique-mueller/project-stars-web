/**
 * External imports
 */
import { Pipe, PipeTransform } from '@angular/core';
import { List } from 'immutable';

/**
 * Internal imports
 */
import { Folder } from './../services/folder';

/**
 * Pipe for filtering (aka searching in) folders (pure function)
 */
@Pipe( {
	name: 'filterFolders',
	pure: true
} )
export class FilterFoldersPipe implements PipeTransform {

	/**
	 * Pipe transform
	 * @param  {List<Folder>} value      List of folders
	 * @param  {string}       filterText Filter text
	 * @return {List<Folder>}            Filtered list of folders
	 */
	public transform( value: List<Folder>, filterText: string ): List<Folder> {

		// Skip if there are no data or search parameters (yet)
		if ( typeof value === 'undefined' || typeof filterText === 'undefined' ) {
			return value;
		}

		// Filter folders
		// - Filter text must exist at least once in the name
		// - Filtering is not case-sensitive
		const optimizedFilterText: string = filterText.toLowerCase(); // To do it only once
		return <List<Folder>> value.filter( ( folder: Folder ) => {
			return folder.get( 'name' ).toLowerCase().indexOf( optimizedFilterText ) > -1;
		} );

	}

}
