/**
 * External imports
 */
import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

/**
 * Shared component: Icon
 */
@Component( {
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'icon'
	},
	selector: 'app-icon',
	templateUrl: './icon.component.html'
} )
export class IconComponent {

	/**
	 * Input: Icon name
	 */
	@Input()
	private name: string;

	/**
	 * Input: Icon color (usually in HEX)
	 */
	@Input()
	private color: string;

	/**
	 * Input: Icon size (usually in px)
	 */
	@Input()
	private size: number;

	/**
	 * Internal: Icon name prefix
	 */
	private prefix: string;

	/**
	 * Constructor
	 */
	constructor() {

		// Setup
		this.name = '';
		this.color = '#000';
		this.size = 24;
		this.prefix = '#icon-';

	}

}
