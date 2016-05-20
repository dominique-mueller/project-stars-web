/**
 * External imports
 */
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { List } from 'immutable';

/**
 * Internal imports
 */
import { IconComponent } from './../icon/icon.component';
import { ClickOutsideDirective } from './../click-outside/click-outside.directive';

/**
 * Shared component: Color picker
 */
@Component( {
	changeDetection: ChangeDetectionStrategy.OnPush,
	directives: [
		IconComponent,
		ClickOutsideDirective
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
		this.colorPresets = List<string>();
		this.selectedColor = null;
		this.allowCustomColor = true;
		this.update = new EventEmitter();
		this.isOpen = false;

	}

	/**
	 * Open dropdown menu
	 */
	private openDropdown(): void {
		this.isOpen = true;
	}

	/**
	 * Close dropdown menu
	 */
	private closeDropdown(): void {
		this.isOpen = false;
	}

	/**
	 * Close dropdown when blurring the dropdown
	 * @param {any}         $event  Event (probably mouse event)
	 * @param {HTMLElement} trigger Trigger HTML element
	 */
	private closeDropdownOnBlur( $event: any, trigger: HTMLElement ): void {

		// Only close the dropdown when the outside-click event wasn't triggered by the trigger element
		if ( $event.path.indexOf( trigger ) === -1 ) {
			this.closeDropdown();
		}

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

}
