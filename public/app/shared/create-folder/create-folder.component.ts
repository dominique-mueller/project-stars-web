/**
 * External imports
 */
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { Map } from 'immutable';

/**
 * Internal imports
 */
import { Folder } from './../../services/folder';
import { IconComponent } from './../icon/icon.component';
import { ClickOutsideDirective } from './../click-outside/click-outside.directive';

/**
 * Shared component: Create folder
 */
@Component( {
	changeDetection: ChangeDetectionStrategy.OnPush,
	directives: [
		IconComponent,
		ClickOutsideDirective
	],
	host: {
		class: 'create-bookmark'
	},
	selector: 'app-create-folder',
	templateUrl: './create-folder.component.html'
} )
export class CreateFolderComponent {

	/**
	 * Input: Folder template
	 */
	@Input()
	private template: Folder;

	/**
	 * Output: Create event, emits data object
	 */
	@Output()
	private create: EventEmitter<any>;

	/**
	 * Internal: Dropdown visibility status
	 */
	private isOpen: boolean;

	/**
	 * Constructor
	 */
	constructor() {

		// Setup
		this.template = <Folder> Map<string, any>();
		this.create = new EventEmitter();
		this.isOpen = false;

	}

	/**
	 * Open dropdown menu
	 * @param {HTMLInputElement} nameInput Name input field
	 */
	private openDropdown( nameInput: HTMLInputElement ): void {
		this.isOpen = true;
		setTimeout( () => { // Otherwhise the focus doesn't get set (probably because it's still on the button)
			nameInput.focus();
		} );
	}

	/**
	 * Close dropdown menu
	 * @param {HTMLInputElement} nameInput Name input field
	 */
	private closeDropdown( nameInput: HTMLInputElement ): void {
		this.isOpen = false;

		// Reset input value
		nameInput.value = this.template.get( 'name' );

	}

	/**
	 * Close dropdown when blurring the dropdown
	 * @param {any}              $event    Event (probably mouse event)
	 * @param {HTMLElement}      trigger   Trigger HTML element
	 * @param {HTMLInputElement} nameInput Name input field
	 */
	private closeDropdownOnBlur(
		$event: any,
		trigger: HTMLElement,
		nameInput: HTMLInputElement ): void {

		// Only close the dropdown when the outside-click event wasn't triggered by the trigger element
		if ( $event.path.indexOf( trigger ) === -1 ) {
			this.closeDropdown( nameInput );
		}

	}

	/**
	 * Click on the create button
	 * @param {HTMLInputElement} nameInput Name input field
	 */
	private onClickOnCreate( nameInput: HTMLInputElement ): void {

		// Construct data
		let data: any = this.template.toJS();
		data.name = nameInput.value;

		// Emit create event
		this.create.emit( data );

		// Then close dropdown
		this.closeDropdown( nameInput );

	}

}
