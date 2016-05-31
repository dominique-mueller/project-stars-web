/**
 * External imports
 */
import { Component, Input, Output, EventEmitter, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FORM_DIRECTIVES, FormBuilder, ControlGroup, Control, Validators } from '@angular/common';
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
		FORM_DIRECTIVES,
		IconComponent,
		ClickOutsideDirective
	],
	host: {
		class: 'create-bookmark',
		'(keyup.esc)': 'closeDropdown()'
	},
	selector: 'app-create-folder',
	templateUrl: './create-folder.component.html'
} )
export class CreateFolderComponent implements OnInit {

	/**
	 * Input: Basic template for a new folder
	 */
	@Input()
	private template: Folder;

	/**
	 * Output: Create event, emits data object
	 */
	@Output()
	private create: EventEmitter<any>;

	/**
	 * Internal: Form builder reference
	 */
	private formBuilder: FormBuilder;

	/**
	 * Internal: Dropdown visibility status flag
	 */
	private isOpen: boolean;

	/**
	 * Form for creating a new folder
	 */
	private createFolderForm: ControlGroup;

	/**
	 * Constructor
	 */
	constructor(
		formBuilder: FormBuilder
	) {

		// Initialize
		this.formBuilder = formBuilder;

		// Setup
		this.template = <Folder> Map<string, any>();
		this.create = new EventEmitter<any>();
		this.isOpen = false;
		this.createFolderForm = null;

	}

	/**
	 * Call this when the view gets initialized
	 */
	public ngOnInit(): void {

		// Set initial form values depending on the provided template
		this.createFolderForm = this.formBuilder.group( {
			name: [ this.template.get( 'name' ), Validators.required ]
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
				( <Control> this.createFolderForm.controls[ 'name' ] ).updateValue( this.template.get( 'name' ) );
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
			this.closeDropdown();
		}
	}

	/**
	 * Submit the form and emit an event for creating a new folder
	 */
	private onSubmit(): void {

		// Construct data
		let newFolder: any = this.template.toJS();
		newFolder.name = this.createFolderForm.value.name;

		// Emit event and close dropdown
		this.create.emit( newFolder );
		this.closeDropdown();

	}

}
