/**
 * Imports
 */
import { Component, Input } from 'angular2/core';

/**
 * Icon Component
 */
@Component( {
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
	private color: string = '#000';

	/**
	 * Size of the icon (in px)
	 */
	@Input()
	private size: number = 24;

	/**
	 * Icon name prefix
	 */
	private prefix: string = '#icon-';

}
