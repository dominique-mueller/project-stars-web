/**
 * External imports
 */
import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

/**
 * Shared component: Loader
 */
@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'loader'
	},
	selector: 'app-loader',
	templateUrl: './loader.component.html'
})
export class LoaderComponent {

	/**
	 * Input: Icon color (usually in HEX)
	 */
	@Input()
	private color: string;

	/**
	 * Constructor
	 */
	constructor() {

		// Setup
		this.color = '#000';

	}

}
