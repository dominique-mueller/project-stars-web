/**
 * External imports
 */
import { Pipe, PipeTransform } from '@angular/core';

/**
 * Url pipe for pretty url formatting
 */
@Pipe( {
	name: 'formatUrl'
} )
export class FormatUrlPipe implements PipeTransform {

	public transform( value: string, args: any[] ): string {

		// Create parser
		let parser: HTMLAnchorElement = document.createElement( 'a' );
		parser.href = value;

		// Make the hostname bold
		value = value.replace( parser.hostname, `<strong>${ parser.hostname }</strong>` );

		// Mark the protocol green when the website uses a secure https connection
		if ( parser.protocol === 'https:' ) {
			value = value.replace( 'https', '<u style="color: green;">https</u>' ); // TODO: Color
		}

		// Done
		return value;

	}

}
