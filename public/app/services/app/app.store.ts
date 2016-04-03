/**
 * External imports
 */
import { List, Map } from 'immutable';

/**
 * App store interface
 */
export interface IAppStore {
	bookmarks: List<Map<string, any>>;
	folders: List<Map<string, any>>;
	labels: Map<string, Map<string, any>>;
	ui: Map<string, any>;
};
