/**
 * Dropdown Item Model
 */
export class DropdownItemModel {

	/**
	 * Attributes
	 */
	private type: string;
	private value: string;
	private label: string;

	/**
	 * Constructor
	 */
	constructor(type: string, value?: string, label?: string) {
		this.type = type;
		this.value = value;
		this.label = label;
	}

}
