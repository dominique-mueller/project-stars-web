/**
 * File: Folder logic service
 */

import { Injectable } from '@angular/core';
import { List } from 'immutable';

import { Folder } from './folder.model';

/**
 * Folder logic service
 */
@Injectable()
export class FolderLogicService {

	/**
	 * Get the root folder (pure function)
	 * @param  {List<Folder>} folders  List of folders to search in
	 * @return {Folder}                Root folder (must exist)
	 */
	public getRootFolder( folders: List<Folder> ): Folder {
		return <Folder> folders.find( ( folder: Folder ) => {
			return folder.get( 'isRoot' );
		} );
	}

	/**
	 * Get a folder by its ID (pure function)
	 * @param  {List<Folder>} folders  List of folders to search in
	 * @param  {string}       folderId Folder ID
	 * @return {Folder}                Folder OR null
	 */
	public getFolderByFolderId( folders: List<Folder>, folderId: string ): Folder {
		const result: Folder = folders.find( ( folder: Folder ) => {
			return folder.get( 'id' ) === folderId;
		} );
		return typeof result === 'undefined' ? null : result;
	}

	/**
	 * Get all subfolders which live inside a parent folder, in the correct order (pure function)
	 * @param  {List<Folder>} folders  List of all folders
	 * @param  {string}       folderId Folder ID
	 * @return {List<Folder>}          List of subfolders in the folder
	 */
	public getSubfoldersByFolderId( folders: List<Folder>, folderId: string ): List<Folder> {
		return List<Folder>().withMutations( ( result: List<Folder> ) => {
			folders.forEach( ( folder: Folder ) => {
				if ( folder.get( 'path' ) === folderId && !folder.get( 'isRoot' ) ) { // Skip root folder (prevent infinite loop)
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

		// Continue if we just added a folder to the list in the previous round
		while ( addedToList ) {
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

	/**
	 * Filter folders, filter text must exist at least once in the title, not case-sensitive (pure function)
	 * Sidenote: Used instead of a pipe because intermedia ngFor variable doesn't exist
	 * @param  {List<Folder>} folders    List of all folders
	 * @param  {string}       filterText Filter text
	 * @return {List<Folder>}            List of filtered folders
	 */
	public filterFolders( folders: List<Folder>, filterText: string ): List<Folder> {
		const optimizedFilterText: string = filterText.toLowerCase(); // Do it only once
		return <List<Folder>> folders.filter( ( folder: Folder ) => {
			return folder.get( 'name' ).toLowerCase().indexOf( optimizedFilterText ) > -1;
		} );
	}

}
