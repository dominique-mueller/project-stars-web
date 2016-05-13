/**
 * External imports
 */
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { List } from 'immutable';

/**
 * Internal imports
 */
import { IconComponent } from './../icon/icon.component';

/**
 * Color picker component
 */
@Component( {
	changeDetection: ChangeDetectionStrategy.OnPush,
	directives: [
		IconComponent
	],
	host: {
		class: 'color-picker'
	},
	selector: 'app-color-picker',
	templateUrl: './color-picker.component.html'
} )
export class ColorPickerComponent {

	/**
	 * Color presets
	 */
	@Input()
	private colorPresets: List<string>;

	/**
	 * Currently selected color
	 */
	@Input()
	private selectedColor: string;

	/**
	 * Allow or disallow custom color picker
	 */
	@Input()
	private allowCustomColor: boolean;

	/**
	 * Update event emitter
	 */
	@Output()
	private update: EventEmitter<string>;

	/**
	 * Dropdown status flag
	 */
	private isOpen: boolean;

	/**
	 * Constructor
	 */
	constructor() {

		// Setup
		this.colorPresets = List([]);
		this.selectedColor = null;
		this.allowCustomColor = true;
		this.update = new EventEmitter();
		this.isOpen = false;

	}

	/**
	 * Call this when selecting a color
	 * @param {string} color Color name (as a HEX value)
	 */
	private onSelectColor(color: string): void {

		// Emit event only if the color actually changed
		if ( this.selectedColor !== color ) {
			this.update.emit( color );
		}
		this.closeDropdown();

	}

	/**
	 * Toggle dropdown menu
	 */
	private toggleDropdown(): void {
		this.isOpen = !this.isOpen;
	}

	/**
	 * Close dropdown menu
	 */
	private closeDropdown(): void {
		this.isOpen = false;
	}

}
