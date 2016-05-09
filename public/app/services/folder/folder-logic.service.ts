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
	 * Get a folder by providing its ID (pure function)
	 * @param  {List<Folder>} folders  List of folders to search in
	 * @param  {number}       folderId Folder ID
	 * @return {Folder}                Folder result OR null
	 */
	public getFolderByFolderId( folders: List<Folder>, folderId: number ): Folder { // TODO: findFolder func.

		// We try to find the folder, and return null if we cannot find it
		let result: Folder = folders.find( ( folder: Folder ) => {
			return folder.get( 'id' ) === folderId;
		} );
		return typeof result === 'undefined' ? null : result;

	}

	/**
	 * Get all subfolders living inside a parent folder (pure function)
	 * @param  {List<Folder>} folders  List of all folders
	 * @param  {number}       folderId Folder ID
	 * @return {List<Folder>}          List of subfolders in the folder
	 */
	public getSubfoldersByFolderId( folders: List<Folder>, folderId: number ): List<Folder> {

		// We create a new list and put only the subfolders in it (ordered)
		return List<Folder>().withMutations( ( result: List<Folder> ) => {
			folders.forEach( ( folder: Folder ) => {
				if ( folder.get( 'path' ) === folderId ) {
					result.set( folder.get( 'position' ) - 1, folder );
				}
			} );
		} );

	}

}
