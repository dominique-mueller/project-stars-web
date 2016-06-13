/**
 * File: Dropdown item model
 */

import { Map } from 'immutable';

/**
 * Dropdown item base
 */
export interface DropdownItem extends Map<string, any> {

	/**
	 * Type of the dropdown item, can be 'link' or 'divider' at the moment
	 */
	type: string;

	/**
	 * Name of the icon that should be displayed before the text
	 */
	icon?: string;

	/**
	 * Dropdown item value
	 */
	value?: string;

	/**
	 * Visible name / label of the dropdown item
	 */
	label?: string;

}
