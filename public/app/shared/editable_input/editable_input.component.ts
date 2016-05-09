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
	private cancel( input: HTMLInputElement ): void {

		// Disable edit mode
		this.disableEditMode(input);

		// Revert value to original one
		input.value = this.originalValue;

	}

	/**
	 * Cancel input changes, but with a short delay
	 * @param {HTMLInputElement} input Input element reference
	 */
	private cancelDelayed( input: HTMLInputElement ): void {

		// So, it happens that the blur event fires before we can either choose to save or cancel.
		// To fix this, we wait a tini tiny bit, and check if we're still in edit mode before continuing.
		setTimeout(
			() => {
				if ( this.isInEditMode ) {
					this.cancel( input );
				}
			},
			250 // Kinda random, should hopefully work ...
		);

	}

	/**
	 * Eventually save input changes
	 * @param {HTMLInputElement} input Input element reference
	 */
	private save( input: HTMLInputElement ): void {

		// Disable edit mode
		this.disableEditMode(input);

		// Send update (only if something has actually changed)
		if ( input.value !== this.originalValue ) {
			this.update.emit( input.value );
		}

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
