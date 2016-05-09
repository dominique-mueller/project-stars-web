/**
 * External imports
 */
import { List, Map } from 'immutable';

/**
 * Internal imports
 */
import { Bookmark } from './../bookmark';
import { Folder } from './../folder';
import { Label } from './../label';

/**
 * App store interface
 */
export interface AppStore {
	bookmarks: List<Bookmark>;
	folders: List<Folder>;
	labels: Map<string, Label>;
	ui: Map<string, any>;
};
