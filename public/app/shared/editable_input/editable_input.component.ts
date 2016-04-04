/**
 * External imports
 */
import { Component, Input, Output, EventEmitter } from 'angular2/core';

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
		class: 'input-editable'
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

	// TODO: Save on enter, cancel on Esc, what happens on blur?

	private edit( input: HTMLInputElement ): void {

		// Save original value (for resetting later on)
		this.originalValue = input.value;

		// Enable edit mode
		this.isInEditMode = true;

		// Set focus
		input.focus();

	}

	private cancel(input: HTMLInputElement): void {

		// Revert value to original one
		input.value = this.originalValue;

		// Disable edit mode
		this.isInEditMode = false;

	}

	private save( input: HTMLInputElement ): void {

		// Send update (only if something has actually changed)
		if ( input.value !== this.originalValue ) {
			this.update.emit( input.value );
		}

		// Disable edit mode
		this.isInEditMode = false;

	}

}
