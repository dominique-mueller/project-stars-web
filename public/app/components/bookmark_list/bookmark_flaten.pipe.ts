/**
 * External imports
 */
import { Pipe, PipeTransform } from 'angular2/core';

/**
 * Bookmark flaten pipe
 */
@Pipe({
	name: 'flaten'
})
export class BookmarkFlatenPipe implements PipeTransform {

	public transform( value: any[], args: any[] ): any {

		// Skip if data is empty
		if (typeof value === 'undefined' || value.length === 0 ) {
			return value;
		}

		// Flatten the tree recursively
		return this.flatten(value);

	}

	private flatten( folders: any[] ): any[] {

		let result: any[] = [];

		// Iterate through folders
		for ( const folder of folders ) {

			// Throw bookmarks into the result
			for ( const bookmark of folder.bookmarks ) {
				result.push( bookmark );
			}

			// Check if subfolder do exist
			if ( typeof folder.folders !== 'undefined' && folder.folders.length > 0 ) {

				// Flatten them
				let tempResult: any[] = this.flatten( folder.folders );

				// Add their results
				for ( const bookmark of tempResult ) {
					result.push( bookmark );
				}

			}

		}

		return result;

	}

}
