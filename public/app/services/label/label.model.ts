/**
 * External imports
 */
import { Map } from 'immutable';

/**
 * Label model interface
 */
export interface Label extends Map<string, any> {

	/**
	 * Label ID
	 */
	id: Number;

	/**
	 * Label name
	 */
	name: String;

	/**
	 * Label color (in HEX)
	 */
	color: String;

}
