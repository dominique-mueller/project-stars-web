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
	 * Get a bookmark by its ID (pure function)
	 * @param  {List<Bookmark>} bookmarks  List of bookmarks to search in
	 * @param  {string}         bookmarkId Bookmark ID
	 * @return {Bookmark}                  Bookmark result OR null
	 */
	public getBookmarkByBookmarkId( bookmarks: List<Bookmark>, bookmarkId: string ): Bookmark {

		// We try to find the bookmark, and return null if we cannot find it
		let result: Bookmark = bookmarks.find( ( bookmark: Bookmark ) => {
			return bookmark.get( 'id' ) === bookmarkId;
		} );
		return typeof result === 'undefined' ? null : result;

	}

	/**
	 * Get all bookmarks in order which live inside a provided folder (pure function)
	 * @param  {List<Bookmark>} bookmarks List of all bookmarks
	 * @param  {string}         folderId  Folder ID
	 * @return {List<Bookmark>}           List of bookmarks in the folder
	 */
	public getBookmarksByFolderId( bookmarks: List<Bookmark>, folderId: string ): List<Bookmark> {

		// We create a new list and put only the included bookmarks in it (ordered)
		return List<Bookmark>().withMutations( ( result: List<Bookmark> ) => {
			bookmarks.forEach( ( bookmark: Bookmark ) => {
				if ( bookmark.get( 'path' ) === folderId ) {
					result.set( bookmark.get( 'position' ) - 1, bookmark );
				}
			} );
		} );

	}

	/**
	 * Filter bookmarks, used instead of a pipe because intermedia ngFor variable doesn't exist (pure function)
	 * @param  {List<Bookmark>} bookmarks  List of all bookmarks
	 * @param  {string}         filterText Filter text
	 * @return {List<Bookmark>}            List of filtered bookmarks
	 */
	public filterBookmarks( bookmarks: List<Bookmark>, filterText: string ): List<Bookmark> {

		// Filter bookmarks
		// - Filter text must exist at least once in the title
		// - Filtering is not case-sensitive
		const optimizedFilterText: string = filterText.toLowerCase(); // Do it only once
		return <List<Bookmark>> bookmarks.filter( ( bookmark: Bookmark ) => {
			return bookmark.get( 'title' ).toLowerCase().indexOf( optimizedFilterText ) > -1;
		} );

	}

}
