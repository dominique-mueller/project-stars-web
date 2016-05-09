/**
 * External imports
 */
import { Component, Input, Output, EventEmitter } from '@angular/core';

/**
 * Internal imports
 */
import { IconComponent } from './../icon/icon.component';

/**
 * Label component
 */
@Component( {
	directives: [
		IconComponent
	],
	host: {
		class: 'label',
		'[style.backgroundColor]': 'label?.get( \'color\' )'
	},
	selector: 'app-label',
	templateUrl: './label.component.html'
} )
export class LabelComponent {

	/**
	 * Label data
	 */
	@Input()
	private label: Map<string, any>;

	/**
	 * Remove label from bookmark
	 */
	@Output()
	private clickOnRemove: EventEmitter<number>;

	/**
	 * Constructor
	 */
	constructor() {

		// Setup
		this.clickOnRemove = new EventEmitter();

	}

}
