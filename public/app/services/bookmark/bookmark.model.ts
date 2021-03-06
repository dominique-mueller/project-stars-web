/**
 * File: Bookmark mdel
 */

import { Map } from 'immutable';

/**
 * Bookmark model interface, based on an immutable map
 */
export interface Bookmark extends Map<string, any> {

	/**
	 * Bookmark ID (string generated by database)
	 */
	id: string;

	/**
	 * Bookmark title
	 */
	title: string;

	/**
	 * Bookmark description
	 */
	description?: string;

	/**
	 * Bookmark url
	 */
	url: string;

	/**
	 * List of assigned label IDs (strings generated by database)
	 */
	labels?: string[];

	/**
	 * Time when this bookmark was created (YYYY-MM-DD)
	 */
	created: string;

	/**
	 * Time when this bookmark was last updated (YYYY-MM-DD)
	 */
	updated?: string;

	/**
	 * ID of the folder this bookmark is in (string generated by database)
	 */
	path: string;

	/**
	 * Bookmark position (start position is always 1)
	 */
	position: number;

}
