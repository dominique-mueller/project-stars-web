/**
 * Dropdown Item Model
 */
export class DropdownItemModel {

	/**
	 * Dropdown item type ('link' or 'divider')
	 */
	private type: string;

	/**
	 * Dropdowm item value
	 */
	private value: string;

	/**
	 * Dropdown item label
	 */
	private label: string;

	/**
	 * Constructor
	 * @param {string} type  Dropdown item type
	 * @param {string} [value] Dropdown item value
	 * @param {string} [label] Dropdown item label
	 */
	constructor(type: string, value?: string, label?: string) {
		this.type = type;
		this.value = value;
		this.label = label;
	}

}
