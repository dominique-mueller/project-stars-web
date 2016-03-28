/**
 * External imports
 */
import { Pipe, PipeTransform } from 'angular2/core';

/**
 * Url pipe for pretty url formatting
 */
@Pipe( {
	name: 'url'
} )
export class UrlPipe implements PipeTransform {

	public transform( value: string, args: any[] ): string {

		// Create parser
		let parser: HTMLAnchorElement = document.createElement( 'a' );
		parser.href = value;

		// Make the hostname bold
		value = value.replace( parser.hostname, `<strong style="color: #777;">${ parser.hostname }</strong>` );

		// Mark the protocol green when the website uses a secure https connection
		if ( parser.protocol === 'https:' ) {
			value = value.replace( 'https://', '<span style="color: green;">https://</span>' );
		}

		// Done
		return value;

	}

}
