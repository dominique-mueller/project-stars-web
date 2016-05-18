/**
 * External imports
 */
import { Map } from 'immutable';

/**
 * Bookmark model interface
 */
export interface Bookmark extends Map<string, any> {

	/**
	 * Bookmark ID
	 */
	id: number; // TODO: String

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
	 * Bookmark favicon (base64 encoded image)
	 */
	favicon?: string;

	/**
	 * List of label ids
	 */
	labels?: number[]; // TODO: String Array

	/**
	 * Time when this bookmark was created
	 */
	created: Date;

	/**
	 * Time when this bookmark was last updated
	 */
	updated?: Date;

	/**
	 * Folder id
	 */
	path: number; // TODO: String

	/**
	 * Bookmark position number
	 */
	position: number;

}
