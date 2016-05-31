/**
 * External imports
 */
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

/**
 * Internal imports
 */
import { IconComponent } from './../icon/icon.component';

/**
 * Shared component: Editable input
 */
@Component( {
	changeDetection: ChangeDetectionStrategy.OnPush,
	directives: [
		IconComponent
	],
	host: {
		class: 'form-component input-editable',
		'[class.is-edited]': 'isInEditMode'
	},
	selector: 'app-input-editable',
	templateUrl: './editable-input.component.html'
} )
export class EditableInputComponent {

	/**
	 * Input: Input name
	 */
	@Input()
	private name: string;

	/**
	 * Input: Input placeholder text
	 */
	@Input()
	private placeholder: string;

	/**
	 * Input: Input type
	 */
	@Input()
	private type: string;

	/**
	 * Input: Label name
	 */
	@Input()
	private label: string;

	/**
	 * Input: Input value
	 */
	@Input()
	private value: string;

	/**
	 * Output: Update event, emits new value
	 */
	@Output()
	private update: EventEmitter<string>;

	/**
	 * Internal: Change detector
	 */
	private changeDetector: ChangeDetectorRef;

	/**
	 * Internal: Edit mode status flag
	 */
	private isInEditMode: boolean;

	/**
	 * Constructor
	 */
	constructor( changeDetector: ChangeDetectorRef ) {

		// Initialize
		this.changeDetector = changeDetector;

		// Setup
		this.name = '';
		this.placeholder = 'Text';
		this.type = 'text';
		this.value = '';
		this.update = new EventEmitter<string>();
		this.isInEditMode = false;

	}

	/**
	 * Click on edit
	 * @param {HTMLInputElement} inputElem Input element reference
	 */
	private clickOnEdit( inputElem: HTMLInputElement ): void {
		this.isInEditMode = true;
		inputElem.focus();
	}

	/**
	 * Click on cancel
	 * @param {HTMLInputElement} inputElem Input element reference
	 */
	private clickOnCancel( inputElem: HTMLInputElement ): void {
		inputElem.value = this.value;
		this.isInEditMode = false;
	}

	/**
	 * When clicking on save, emit the save event and disable edit mode
	 * @param {string} value Input value
	 */
	private clickOnSave( value: string ): void {
		if ( value !== this.value ) {
			this.update.emit( value );
		}
		this.isInEditMode = false;
	}

}
