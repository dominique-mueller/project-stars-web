/**
 * Internal imports
 */
import { IBookmark } from './../bookmark/bookmark.service';
import { IFolder } from './../folder/folder.service';
import { ILabel } from './../label/label.service';

/**
 * App store interface
 */
export interface IAppStore {
	bookmarks: IBookmark[];
	folders: IFolder[];
	labels: ILabel[];
};
