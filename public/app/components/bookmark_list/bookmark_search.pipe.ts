/**
 * External imports
 */
import { Pipe, PipeTransform } from 'angular2/core';

/**
 * Bookmark search pipe
 */
@Pipe( {
	name: 'search'
} )
export class BookmarkSearchPipe implements PipeTransform {

	public transform( value: any[], args: any[] ): any {

		// Skip if data does not exist or we don't search right now
		if ( typeof value === 'undefined' || args[0] === '' ) {
			return value;
		}

		// Filter (not case-sensitiv, contains not begins)
		return value.filter( ( item: any ) => {
			return item.title.toLowerCase().indexOf( args[ 0 ].toLowerCase() ) > -1;
		} );

	}

}
