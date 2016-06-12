/**
 * File: Bookmark logic service
 */

import { Injectable } from '@angular/core';
import { List } from 'immutable';

import { Bookmark } from './bookmark.model';

/**
 * Bookmark logic service
 */
@Injectable()
export class BookmarkLogicService {

	/**
	 * Get a bookmark by its ID (pure function)
	 * @param  {List<Bookmark>} bookmarks  List of bookmarks to search in
	 * @param  {string}         bookmarkId Bookmark ID
	 * @return {Bookmark}                  Bookmark OR null
	 */
	public getBookmarkByBookmarkId( bookmarks: List<Bookmark>, bookmarkId: string ): Bookmark {
		const result: Bookmark = bookmarks.find( ( bookmark: Bookmark ) => {
			return bookmark.get( 'id' ) === bookmarkId;
		} );
		return typeof result === 'undefined' ? null : result;
	}

	/**
	 * Get all bookmarks which live inside a provided folder, in the correct order (pure function)
	 * @param  {List<Bookmark>} bookmarks List of all bookmarks
	 * @param  {string}         folderId  Folder ID
	 * @return {List<Bookmark>}           List of bookmarks
	 */
	public getBookmarksByFolderId( bookmarks: List<Bookmark>, folderId: string ): List<Bookmark> {
		return List<Bookmark>().withMutations( ( result: List<Bookmark> ) => {
			bookmarks.forEach( ( bookmark: Bookmark ) => {
				if ( bookmark.get( 'path' ) === folderId ) {
					result.set( bookmark.get( 'position' ) - 1, bookmark );
				}
			} );
		} );
	}

	/**
	 * Filter bookmarks, filter text must exist at least once in the title, not case-sensitive (pure function)
	 * Sidenote: Used instead of a pipe because intermedia ngFor variable doesn't exist
	 * @param  {List<Bookmark>} bookmarks  List of all bookmarks
	 * @param  {string}         filterText Filter text
	 * @return {List<Bookmark>}            List of filtered bookmarks
	 */
	public filterBookmarks( bookmarks: List<Bookmark>, filterText: string ): List<Bookmark> {
		const optimizedFilterText: string = filterText.toLowerCase(); // Do it only once
		return <List<Bookmark>> bookmarks.filter( ( bookmark: Bookmark ) => {
			return bookmark.get( 'title' ).toLowerCase().indexOf( optimizedFilterText ) > -1;
		} );
	}

}
