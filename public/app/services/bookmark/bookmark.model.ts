/**
 * Bookmark model
 */
export class Bookmark {

	/**
	 * Bookmark ID
	 */
	public id: number;

	/**
	 * Bookmark title
	 */
	public title: string;

	/**
	 * Bookmark description
	 */
	public description: string;

	/**
	 * Bookmark url
	 */
	public url: string;

	/**
	 * Bookmark favicon, BASE64 encoded
	 */
	public favicon: string;

	/**
	 * List of labels (ids only) assigned to this bookmark
	 */
	public labels: number[];

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
	public path: string[];

	/**
	 * Bookmark position number
	 */
	public position: number;

}
