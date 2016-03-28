/**
 * External imports
 */
import { Pipe, PipeTransform } from 'angular2/core';

/**
 * Search pipe for filtering bookmarks and folders
 */
@Pipe( {
	name: 'search'
} )
export class SearchPipe implements PipeTransform {

	public transform( value: any[], args: any[] ): any {

		// Skip if data does not exist or we don't search right now
		if ( typeof value === 'undefined' || args[ 1 ].value.length === 0 ) {
			return value;
		}

		// Filter bookmarks and folders differently
		switch ( args[ 0 ] ) {

			// Filter bookmarks (not case-sensitive, should contain the search value)
			case 'bookmarks':
				return value.filter( ( bookmark: any ) => {
					return bookmark.title.toLowerCase().indexOf( args[ 1 ].value.toLowerCase() ) > -1;
				} );

			// Filter folders (not case-sensitive, should contain the search value)
			case 'folders':
				return value.filter( ( folder: any ) => {
					return folder.name.toLowerCase().indexOf( args[ 1 ].value.toLowerCase() ) > -1;
				} );

			// Default (returns everything)
			default:
				return value;

		}

	}

}
