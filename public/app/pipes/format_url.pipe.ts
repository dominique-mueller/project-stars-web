/**
 * External imports
 */
import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe for pretty URL formatting (hostname, https)
 */
@Pipe( {
	name: 'formatUrl'
} )
export class FormatUrlPipe implements PipeTransform {

	/**
	 * Transform
	 * @param  {string} value Value
	 * @param  {any[]}  args  List of arguments
	 * @return {string}       New value
	 */
	public transform( value: string, args: any[] ): string {

		// Create parser
		let parser: HTMLAnchorElement = document.createElement( 'a' );
		parser.href = value;

		// Make the hostname bold
		value = value.replace( parser.hostname, `<strong>${ parser.hostname }</strong>` );

		// Mark the protocol green when the website uses a secure https connection
		if ( parser.protocol === 'https:' ) {
			value = value.replace( 'https', '<em style="color: green;">https</em>' ); // TODO: Color
		}

		// Done
		return value;

	}

}
