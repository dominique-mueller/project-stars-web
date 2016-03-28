/**
 * Internal imports
 */
import { IBookmark } from './../bookmark/bookmark.service';
import { IFolder } from './../folder/folder.service';

/**
 * App store interface
 */
export interface IAppStore {
	bookmarks: IBookmark[];
	folders: IFolder[];
};
