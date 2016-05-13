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
 * Shared component: Label simple
 */
@Component( {
	changeDetection: ChangeDetectionStrategy.OnPush,
	directives: [
		IconComponent
	],
	host: {
		class: 'label-simple',
		'[style.backgroundColor]': 'label?.get( \'color\' )'
	},
	selector: 'app-label-simple',
	templateUrl: './label-simple.component.html'
} )
export class LabelSimpleComponent {

	/**
	 * Input: Label
	 */
	@Input()
	private label: Label;

	/**
	 * Input: Flag for allowing to remove the label
	 */
	@Input()
	private isRemovable: boolean;

	/**
	 * Output: Remove event, emits label ID
	 */
	@Output()
	private remove: EventEmitter<number>;

	/**
	 * Constructor
	 */
	constructor() {

		// Setup
		this.label = null;
		this.isRemovable = false;
		this.remove = new EventEmitter();

	}

	/**
	 * Remove / unassign label
	 */
	private clickOnRemove(): void {
		this.remove.emit( this.label.get( 'id' ) );
	}

}
