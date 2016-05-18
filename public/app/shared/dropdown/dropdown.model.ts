/**
 * Dropdown item base
 */
export class DropdownItem {

	/**
	 * Type of the dropdown item
	 */
	public type: String;

}

/**
 * Dropdown link item
 */
export class DropdownLink extends DropdownItem {

	/**
	 * Dropdowm item value
	 */
	private value: String;

	/**
	 * Dropdown item label
	 */
	private label: String;

	/**
	 * Constructor
	 * @param {string} value Dropdown item value
	 * @param {string} label Dropdown item label
	 */
	constructor( value: String, label: String ) {

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
