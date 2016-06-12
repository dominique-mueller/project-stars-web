/**
 * File: Format URL pipe
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

		// Skip of data are not here yet (async)
		if ( value === null ) {
			return value;
		}

		// Create parser
		let parser: HTMLAnchorElement = document.createElement( 'a' );
		parser.href = value;

		// Make the hostname bold and a https connection green
		value = value.replace( parser.hostname, `<strong>${ parser.hostname }</strong>` );
		if ( parser.protocol === 'https:' ) {
			value = value.replace( 'https', '<em>https</em>' );
		}

		return value;
	}

}
