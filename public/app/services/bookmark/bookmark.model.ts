/**
 * Bookmark model interface
 */
export interface IBookmark {

	/**
	 * Bookmark ID
	 */
	id: number;

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
	labels?: number[];

	/**
	 * Time when this bookmark was created
	 */
	created: Date;

	/**
	 * Time when this bookmark was last updated
	 */
	updated?: Date;

	/**
	 * Time when this bookmark was archived
	 */
	archived?: Date;

	/**
	 * Folder id
	 */
	path: number;

	/**
	 * Bookmark position number
	 */
	position: number;

}
