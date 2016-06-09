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
		class: 'color-picker',
		'(keyup.esc)': 'closeDropdown()'
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
		this.update = new EventEmitter<string>();
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
	 * Close dropdown menu bridge (when clicking outside)
	 * @param {any}         $event      Event (probably mouse event)
	 * @param {HTMLElement} triggerElem Trigger HTML element
	 */
	private closeDropdownOnBlur( $event: any, triggerElem: HTMLElement ): void {

		// Only close the dropdown when the outside-click event wasn't triggered by the trigger element
		if ( $event.path.indexOf( triggerElem ) === -1 ) {
			this.closeDropdown();
		}

	}

	/**
	 * When selecting a color, emit an update event and close the dropdown
	 * @param {string} color Color (HEX value)
	 */
	private onSelectColor( color: string ): void {
		if ( this.selectedColor !== color ) {
			this.update.emit( color );
		}
		this.closeDropdown();
	}

}
