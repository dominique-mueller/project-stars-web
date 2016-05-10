/**
 * External imports
 */
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

/**
 * Internal imports
 */
import { Label } from './../../services/label';
import { IconComponent } from './../icon/icon.component';

/**
 * Label component
 */
@Component( {
	changeDetection: ChangeDetectionStrategy.OnPush,
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
	private label: Label;

	/**
	 * Allow the label to be removable
	 */
	@Input()
	private isRemovable: boolean;

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
		this.isRemovable = false;
		this.clickOnRemove = new EventEmitter();

	}

	/**
	 * Remove (unassign) label
	 */
	private removeLabel(): void {
		this.clickOnRemove.emit( this.label.get( 'id' ) );
	}

}
