/**
 * Imports
 */
import { Label } from '../label/label.model';

/**
 * Bookmark Model
 */
export class Bookmark {

	/**
	 * Bookmark ID
	 */
	public id: Number;

	/**
	 * Bookmark title
	 */
	public title: String;

	/**
	 * Bookmark description
	 */
	public description: String;

	/**
	 * Bookmark url
	 */
	public url: String;

	/**
	 * Bookmark favicon, BASE64 encoded
	 */
	public favicon: String;

	/**
	 * List of labels assigned to this bookmark
	 */
	public labes: Label[];

	/**
	 * Time when this bookmark was created
	 */
	public created: Date;

	/**
	 * Time when this bookmark was last updated
	 */
	public updated: Date;

	/**
	 * Time when this bookmark was archived
	 */
	public archived: Date;

	/**
	 * Full path of this bookmark
	 */
	public path: String[];

	/**
	 * Bookmark position number
	 */
	public position: Number;

}
