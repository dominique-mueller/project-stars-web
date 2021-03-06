/**
 * File: User model
 */

import { Map } from 'immutable';

/**
 * User model interface, based on an immutable map
 */
export interface User extends Map<string, any> {

	/**
	 * User ID (string generated by database)
	 */
	id: string;

	/**
	 * First name
	 */
	firstName: string;

	/**
	 * Last name
	 */
	lastName: string;

	/**
	 * E-Mail address
	 */
	emailAddress: string;

}
