/**
 * File: Create bookmark component
 */

import { Component, Input, Output, EventEmitter, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FORM_DIRECTIVES, FormBuilder, ControlGroup, Control, Validators } from '@angular/common';
import { Map } from 'immutable';

import { Bookmark } from './../../services/bookmark';
import { ClickOutsideDirective } from './../click-outside/click-outside.directive';
import { IconComponent } from './../icon/icon.component';

/**
 * Shared component: Create bookmark
 */
@Component( {
	changeDetection: ChangeDetectionStrategy.OnPush,
	directives: [
		FORM_DIRECTIVES,
		ClickOutsideDirective,
		IconComponent
	],
	host: {
		class: 'create-bookmark',
		'(keyup.esc)': 'closeDropdown()'
	},
	selector: 'app-create-bookmark',
	templateUrl: './create-bookmark.component.html'
} )
export class CreateBookmarkComponent implements OnInit {

	/**
	 * Input: Basic tempalte for a new bookmark
	 */
	@Input()
	private template: Bookmark;

	/**
	 * Output: Create event, emits data object
	 */
	@Output()
	private create: EventEmitter<any>;

	/**
	 * Internal: Form builder
	 */
	private formBuilder: FormBuilder;

	/**
	 * Internal: Dropdown visibility status flag
	 */
	private isOpen: boolean;

	/**
	 * Form for creating a new bookmark
	 */
	private createBookmarkForm: ControlGroup;

	/**
	 * Constructor
	 * @param {FormBuilder} formBuilder Form builder
	 */
	constructor(
		formBuilder: FormBuilder
	) {

		// Initialize
		this.formBuilder = formBuilder;

		// Setup
		this.template = <Bookmark> Map<string, any>();
		this.create = new EventEmitter<any>();
		this.isOpen = false;
		this.createBookmarkForm = null;

	}

	/**
	 * Call this when the view gets initialized
	 */
	public ngOnInit(): void {

		// Set initial form values depending on the provided template
		this.createBookmarkForm = this.formBuilder.group( {
			title: [ this.template.get( 'title' ), Validators.required ],
			url: [ this.template.get( 'url' ), Validators.required] // TODO: Add custom URL validator?
		} );

	}

	/**
	 * Open dropdown menu
	 * @param {HTMLInputElement} firstInputElem First input field
	 */
	private openDropdown( firstInputElem: HTMLInputElement ): void {
		this.isOpen = true;
		setTimeout( () => { // Otherwhise the focus doesn't get set
			firstInputElem.focus();
		} );
	}

	/**
	 * Close dropdown menu, then reset all form values
	 */
	private closeDropdown(): void {
		this.isOpen = false;
		setTimeout(
			() => {
				( <Control> this.createBookmarkForm.controls[ 'title' ] ).updateValue( this.template.get( 'title' ) );
				( <Control> this.createBookmarkForm.controls[ 'url' ] ).updateValue( this.template.get( 'url' ) );
			},
			300
		);
	}

	/**
	 * Close dropdown bridge for only closing when the trigger wasn't used to open the dropdown
	 * @param {any}         $event      Event (probably mouse event)
	 * @param {HTMLElement} triggerElem Trigger HTML element
	 */
	private closeDropdownOnBlur( $event: any, triggerElem: HTMLElement ): void {
		if ( $event.path.indexOf( triggerElem ) === -1 ) {
			this.closeDropdown( );
		}
	}

	/**
	 * Submit the form and emit an event for creating a new bookmark
	 */
	private onSubmit(): void {
		let newBookmark: any = this.template.toJS();
		newBookmark.title = this.createBookmarkForm.value.title;
		newBookmark.url = this.createBookmarkForm.value.url;
		this.create.emit( newBookmark );
		this.closeDropdown();
	}

}
