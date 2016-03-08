/**
 * Dropdown item base
 */
export class DropdownItem {

	/**
	 * Type of the dropdown item
	 */
	public type: string;

}

/**
 * Dropdown link item
 */
export class DropdownLink extends DropdownItem {

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
	 * @param {string} value Dropdown item value
	 * @param {string} label Dropdown item label
	 */
	constructor(value: string, label: string) {

		// Call super class
		super();

		// Set values
		this.type = 'link';
		this.value = value;
		this.label = label;

	}

}

/**
 * Dropdown divider item
 */
export class DropdownDivider extends DropdownItem {

	/**
	 * Constructor
	 */
	constructor() {

		// Call super class
		super();

		// Set values
		this.type = 'divider';

	}

}
