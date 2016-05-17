/**
 * External imports
 */
import { Map } from 'immutable';

/**
 * Folder model interface
 */
export interface Folder extends Map<string, any> {

	/**
	 * Folder ID
	 */
	id: number;

	/**
	 * Folder name
	 */
	name: string;

	/**
	 * Folder path
	 */
	path?: number;

	/**
	 * Folder position
	 */
	position: number;

}
