/**
 * External imports
 */
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { Map } from 'immutable';

/**
 * Internal imports
 */
import { Bookmark } from './../../services/bookmark';
import { IconComponent } from './../icon/icon.component';
import { ClickOutsideDirective } from './../click-outside/click-outside.directive';

/**
 * Shared component: Create bookmark
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
	selector: 'app-create-bookmark',
	templateUrl: './create-bookmark.component.html'
} )
export class CreateBookmarkComponent {

	/**
	 * Input: Bookmark template
	 */
	@Input()
	private template: Bookmark;

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
		this.template = <Bookmark> Map<string, any>();
		this.create = new EventEmitter();
		this.isOpen = false;

	}

	/**
	 * Open dropdown menu
	 * @param {HTMLInputElement} titleInput Title input field
	 */
	private openDropdown( titleInput: HTMLInputElement ): void {
		this.isOpen = true;
		setTimeout( () => { // Otherwhise the focus doesn't get set (probably because it's still on the button)
			titleInput.focus();
		} );
	}

	/**
	 * Close dropdown menu
	 * @param {HTMLInputElement} titleInput Title input field
	 * @param {HTMLInputElement} urlInput   URL input field
	 */
	private closeDropdown( titleInput: HTMLInputElement, urlInput: HTMLInputElement ): void {
		this.isOpen = false;

		// Reset input values
		titleInput.value = this.template.get( 'title' );
		urlInput.value = this.template.get( 'url' );

	}

	/**
	 * Close dropdown when blurring the dropdown
	 * @param {any}              $event     Event (probably mouse event)
	 * @param {HTMLElement}      trigger    Trigger HTML element
	 * @param {HTMLInputElement} titleInput Title input field
	 * @param {HTMLInputElement} urlInput   URL input field
	 */
	private closeDropdownOnBlur(
		$event: any,
		trigger: HTMLElement,
		titleInput: HTMLInputElement,
		urlInput: HTMLInputElement ): void {

		// Only close the dropdown when the outside-click event wasn't triggered by the trigger element
		if ( $event.path.indexOf( trigger ) === -1 ) {
			this.closeDropdown( titleInput, urlInput );
		}

	}

	/**
	 * Click on the create button
	 * @param {HTMLInputElement} titleInput Title input field
	 * @param {HTMLInputElement} urlInput   URL input field
	 */
	private onClickOnCreate( titleInput: HTMLInputElement, urlInput: HTMLInputElement ): void {

		// Construct data
		let data: any = this.template.toJS();
		data.title = titleInput.value;
		data.url = urlInput.value;

		// Emit create event
		this.create.emit( data );

		// Then close dropdown
		this.closeDropdown( titleInput, urlInput );

	}

}
