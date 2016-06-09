/**
 * External imports
 */
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { List } from 'immutable';

/**
 * Internal imports
 */
import { AppService } from './../../services/app';
import { Label } from './../../services/label';
import { ColorPickerComponent } from './../color-picker/color-picker.component';
import { IconComponent } from './../icon/icon.component';

/**
 * Label advanced component
 */
@Component( {
	changeDetection: ChangeDetectionStrategy.OnPush,
	directives: [
		ColorPickerComponent,
		IconComponent
	],
	host: {
		class: 'label-advanced',
		'[class.is-edited]': 'isInEditMode'
	},
	selector: 'app-label-advanced',
	templateUrl: './label-advanced.component.html'
} )
export class LabelAdvancedComponent {

	/**
	 * App service
	 */
	private appService: AppService;

	/**
	 * Label data
	 */
	@Input()
	private label: Label;

	/**
	 * Make the label editable
	 */
	@Input()
	private editable: boolean;

	/**
	 * Make the label creatable
	 */
	@Input()
	private creatable: boolean;

	/**
	 * Change edit mode event, emitting status as boolean value
	 */
	@Output()
	private changeEditMode: EventEmitter<boolean>;

	/**
	 * Update event, emitting data
	 */
	@Output()
	private update: EventEmitter<any>;

	/**
	 * Delete event, emitting nothing (null)
	 */
	@Output()
	private delete: EventEmitter<any>;

	/**
	 * Status flag for the edit mode
	 */
	private isInEditMode: boolean;

	/**
	 * Label color preview
	 */
	private labelColorPreview: string;

	/**
	 * List of color presets for labels
	 */
	private labelColorPresets: List<string>;

	/**
	 * Constructor
	 */
	constructor( appService: AppService ) {

		// Initialize
		this.appService = appService;

		// Setup
		this.label = null;
		this.editable = false;
		this.creatable = false;
		this.changeEditMode = new EventEmitter<boolean>();
		this.update = new EventEmitter<any>();
		this.delete = new EventEmitter<any>();
		this.isInEditMode = false;
		this.labelColorPreview = '';
		this.labelColorPresets = appService.COLOR_PRESETS;

	}

	/**
	 * Update preview color when a color update arrives from the color picker
	 * @param {string} color Color
	 */
	private onColorUpdate( color: string ): void {
		this.labelColorPreview = color;
	}

	/**
	 * Delete label
	 */
	private clickOnDelete(): void {
		this.delete.emit( null );
	}

	/**
	 * Click on edit
	 */
	private clickOnEdit( nameInput: HTMLInputElement ): void {
		this.labelColorPreview = this.label.get( 'color' );
		this.isInEditMode = true;
		this.changeEditMode.emit( true );
		nameInput.focus();
	}

	/**
	 * Click on cancel
	 * @param {HTMLInputElement} nameInput Label name input field
	 */
	private clickOnCancel( nameInput: HTMLInputElement ): void {
		nameInput.value = this.label.get( 'name' ); // Manually reset name
		this.labelColorPreview = this.label.get( 'color' ); // Manually reset color
		this.isInEditMode = false;
		this.changeEditMode.emit( false );
	}

	/**
	 * Click on save
	 * @param {HTMLInputElement} nameInput Label name input field
	 */
	private clickOnSave( nameInput: HTMLInputElement ): void {

		let data: any = {};
		if ( this.creatable ) {

			// Set all data
			data[ 'name' ] = nameInput.value;
			data[ 'color' ] = this.labelColorPreview;
			this.update.emit( data );

			// Reset input field
			nameInput.value = '';

		} else {

			// Check for changed data
			let hasChanged: boolean = false;
			if ( this.label.get( 'name' ) !== nameInput.value ) {
				data[ 'name' ] = nameInput.value;
				hasChanged = true;
			}
			if ( this.label.get( 'color' ) !== this.labelColorPreview ) {
				data[ 'color' ] = this.labelColorPreview;
				hasChanged = true;
			}

			// Emit update event only if something has actually changed
			if ( hasChanged ) {
				this.update.emit( data );
			}

		}
		this.isInEditMode = false;
		this.changeEditMode.emit( false );

	}

}
