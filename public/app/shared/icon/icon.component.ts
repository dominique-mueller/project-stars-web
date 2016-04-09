/**
 * External imports
 */
import { Component, Input } from 'angular2/core';

/**
 * Icon Component
 */
@Component( {
	host: {
		class: 'icon',
		'[style.width]': 'size',
		'[style.height]': 'size'
	},
	selector: 'app-icon',
	templateUrl: './icon.component.html'
} )
export class IconComponent {

	/**
	 * Name of the icon
	 */
	@Input()
	private name: string;

	/**
	 * Color of the icon
	 */
	@Input()
	private color: string;

	/**
	 * Size of the icon (in px)
	 */
	@Input()
	private size: number;

	/**
	 * Icon name prefix
	 */
	private prefix: string = '#icon-';

	/**
	 * Constructor
	 */
	constructor() {

		// Setup
		this.size = 24;
		this.color = '#000';

	}

}
