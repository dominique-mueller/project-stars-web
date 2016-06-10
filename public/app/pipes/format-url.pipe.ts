/**
 * Format URL pipe
 */

/**
 * External imports
 */
import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe for pretty URL formatting (hostname, https)
 */
@Pipe( {
	name: 'appFormatUrl',
	pure: true
} )
export class FormatUrlPipe implements PipeTransform {

	/**
	 * Pipe transform
	 * @param  {string} value Bookmark URL
	 * @return {string}       Formatted bookmark URL
	 */
	public transform( value: string ): string {

		// Skip of data are not here yet
		if ( typeof value === 'undefined' ) {
			return value;
		}

		// Create parser
		let parser: HTMLAnchorElement = document.createElement( 'a' );
		parser.href = value;

		// Make the hostname bold
		value = value.replace( parser.hostname, `<strong>${ parser.hostname }</strong>` );

		// Mark the protocol green when the website uses a secure https connection
		if ( parser.protocol === 'https:' ) {
			value = value.replace( 'https', '<em>https</em>' );
		}

		// Done
		return value;

	}

}
