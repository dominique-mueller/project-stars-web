/**
 * External imports
 */
import { Injectable } from '@angular/core';
import { List } from 'immutable';

/**
 * Internal imports
 */
import { Bookmark } from './bookmark.model';

/**
 * Bookmark logic service
 * Contains pure functions for getting, filtering or manipulating bookmark data
 */
@Injectable()
export class BookmarkLogicService {

	/**
	 * Get a bookmark by providing its ID (pure function)
	 * @param  {List<Bookmark>} bookmarks  List of bookmarks to search in
	 * @param  {number}         bookmarkId Bookmark ID
	 * @return {Bookmark}                  Bookmark result OR null
	 */
	public getBookmarkByBookmarkId( bookmarks: List<Bookmark>, bookmarkId: number ): Bookmark {

		// We try to find the bookmark, and return null if we cannot find it
		let result: Bookmark = bookmarks.find( ( bookmark: Bookmark ) => {
			return bookmark.get( 'id' ) === bookmarkId;
		} );
		return typeof result === 'undefined' ? null : result;

	}

	/**
	 * Get all bookmarks living inside a parent folder (pure function)
	 * @param  {List<Bookmark>} bookmarks List of all bookmarks
	 * @param  {number}         folderId  Folder ID
	 * @return {List<Bookmark>}           List of bookmarks in the folder
	 */
	public getBookmarksByFolderId( bookmarks: List<Bookmark>, folderId: number ): List<Bookmark> {

		// We create a new list and put only the included bookmarks in it (ordered)
		return List<Bookmark>().withMutations( ( result: List<Bookmark> ) => {
			bookmarks.forEach( ( bookmark: Bookmark ) => {
				if ( bookmark.get( 'path' ) === folderId ) {
					result.set( bookmark.get( 'position' ) - 1, bookmark );
				}
			} );
		} );

	}

}
