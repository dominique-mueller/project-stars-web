/**
 * External imports
 */
import { Injectable } from '@angular/core';
import { List } from 'immutable';

/**
 * Internal imports
 */
import { Folder } from './folder.model';

/**
 * Folder logic service
 * Contains pure functions for getting, filtering or manipulating folder data
 */
@Injectable()
export class FolderLogicService {

	/**
	 * Get the root folder
	 * @param  {List<Folder>} folders  List of folders to search in
	 * @return {Folder}                Root folder (must exist)
	 */
	public getRootFolder( folders: List<Folder> ): Folder {

		// Find the root folder by the isRoot attribute
		return <Folder> folders.find( ( folder: Folder ) => {
			return folder.get( 'isRoot' );
		} );

	}

	/**
	 * Get a folder by its ID (pure function)
	 * @param  {List<Folder>} folders  List of folders to search in
	 * @param  {string}       folderId Folder ID
	 * @return {Folder}                Folder result OR null
	 */
	public getFolderByFolderId( folders: List<Folder>, folderId: string ): Folder {

		// We try to find the folder, and return null if we cannot find it
		let result: Folder = folders.find( ( folder: Folder ) => {
			return folder.get( 'id' ) === folderId;
		} );
		return typeof result === 'undefined' ? null : result;

	}

	/**
	 * Get all subfolders in order which live inside a parent folder (pure function)
	 * @param  {List<Folder>} folders  List of all folders
	 * @param  {string}       folderId Folder ID
	 * @return {List<Folder>}          List of subfolders in the folder
	 */
	public getSubfoldersByFolderId( folders: List<Folder>, folderId: string ): List<Folder> {

		// We create a new list and put only the subfolders in it (ordered)
		return List<Folder>().withMutations( ( result: List<Folder> ) => {
			folders.forEach( ( folder: Folder ) => {
				if ( folder.get( 'path' ) === folderId ) {
					result.set( folder.get( 'position' ) - 1, folder );
				}
			} );
		} );

	}

	/**
	 * Get all subfolder IDs recursively which live inside the provided folder (pure function)
	 * @param  {List<Folder>}  folders  List of all folders
	 * @param  {string}        folderId Folder ID
	 * @return {Array<string>}          List of folder IDs
	 */
	public getRecursiveSubfolderIds( folders: List<Folder>, folderId: string ): Array<string> {

		let addedToList: boolean = true;
		let result: Array<string> = [];

		// Continue with the next round if we just added a folder to the list
		while ( addedToList ) {

			// Reset
			addedToList = false;

			// If we find direct children, add them to the result list and filter them out
			folders = <List<Folder>> folders.filter( ( folder: Folder ) => {
				if ( result.indexOf( folder.get( 'path' ) ) > -1 ) {
					addedToList = true;
					result.push( folder.get( 'id' ) );
					return false;
				} else {
					return true;
				}
			} );

		}

		return result;

	}

}
