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
	id: number; // TODO: String

	/**
	 * Folder name
	 */
	name: string;

	/**
	 * Folder path
	 */
	path?: number; // TODO: String

	/**
	 * Folder position
	 */
	position: number;

	/**
	 * Root folder
	 */
	isRoot: boolean; // TODO: New param => implement

}
