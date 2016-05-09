/**
 * External imports
 */
import { Component, Input, Output, EventEmitter } from '@angular/core';

/**
 * Internal imports
 */
import { IconComponent } from './../icon/icon.component';

/**
 * Editable input component
 */
@Component( {
	directives: [
		IconComponent
	],
	host: {
		class: 'form-component input-editable'
	},
	selector: 'app-input-editable',
	templateUrl: './editable_input.component.html'
} )
export class EditableInputComponent {

	/**
	 * Name
	 */
	@Input()
	private name: string;

	/**
	 * Input placeholder
	 */
	@Input()
	private placeholder: string;

	/**
	 * Input type
	 */
	@Input()
	private type: string;

	/**
	 * Label name
	 */
	@Input()
	private label: string;

	/**
	 * Incoming data
	 */
	@Input()
	private value: string;

	/**
	 * Event when new data is being saved
	 */
	@Output()
	private update: EventEmitter<string>;

	/**
	 * Status flag for the edit mode
	 */
	private isInEditMode: boolean;

	/**
	 * Backup of the original value (used for reset)
	 */
	private originalValue: string;

	/**
	 * Constructor
	 */
	constructor() {

		// Setup
		this.update = new EventEmitter();
		this.isInEditMode = false;

	}

	/**
	 * Start editing the input
	 * @param {HTMLInputElement} input Input element reference
	 */
	private edit( input: HTMLInputElement ): void {

		// Ony switch when necessary
		if ( !this.isInEditMode ) {

			// Save original value (for resetting later on)
			this.originalValue = input.value;

			// Enable edit mode
			this.enableEditMode( input );

		}

	}

	/**
	 * Cancel input changes
	 * @param {HTMLInputElement} input Input element reference
	 */
	private cancel(input: HTMLInputElement): void {

		// Revert value to original one
		input.value = this.originalValue;

		// Disable edit mode
		this.disableEditMode( input );

	}

	/**
	 * Eventually save input changes
	 * @param {HTMLInputElement} input Input element reference
	 */
	private save( input: HTMLInputElement ): void {

		// Send update (only if something has actually changed)
		if ( input.value !== this.originalValue ) {
			this.update.emit( input.value );
		}

		// Disable edit mode
		this.disableEditMode( input );

	}

	/**
	 * Enable edit mode
	 * @param {HTMLInputElement} input Input element reference
	 */
	private enableEditMode(input: HTMLInputElement): void {

		// Enable edit mode
		this.isInEditMode = true;

		// Set focus
		input.focus();

	}

	/**
	 * Disable edit mode
	 * @param {HTMLInputElement} input Input element reference
	 */
	private disableEditMode(input: HTMLInputElement): void {

		// Disable edit mode
		this.isInEditMode = false;

		// Remove focus
		input.blur();

	}

}
