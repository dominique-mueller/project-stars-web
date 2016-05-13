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
 * Shared component: Color picker
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
	 * Input: List of color presets
	 */
	@Input()
	private colorPresets: List<string>;

	/**
	 * Input: Currently selected color (HEX value)
	 */
	@Input()
	private selectedColor: string;

	/**
	 * Input: Flag for allowing to choose a custom color
	 */
	@Input()
	private allowCustomColor: boolean;

	/**
	 * Output: Update event, emits color (HEX value)
	 */
	@Output()
	private update: EventEmitter<string>;

	/**
	 * Internal: Dropdown visibility flag
	 */
	private isOpen: boolean;

	/**
	 * Constructor
	 */
	constructor() {

		// Setup
		this.colorPresets = List( [] );
		this.selectedColor = null;
		this.allowCustomColor = true;
		this.update = new EventEmitter();
		this.isOpen = false;

	}

	/**
	 * Call this when selecting a color
	 * @param {string} color Color (HEX value)
	 */
	private onSelectColor( color: string ): void {

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
