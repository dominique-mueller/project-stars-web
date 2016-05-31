/**
 * External imports
 */
import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

/**
 * Internal imports
 */
import { DialogConfirmService } from './dialog-confirm.service';
import { IconComponent } from './../icon/icon.component';

/**
 * Shared component: Dialog confirm
 */
@Component( {
	changeDetection: ChangeDetectionStrategy.OnPush,
	directives: [
		IconComponent
	],
	host: {
		class: 'dialog-confirm',
		'(keyup.esc)': 'onCancel()',
		'(keyup.enter)': 'onConfirm()'
	},
	selector: 'app-dialog-confirm',
	templateUrl: './dialog-confirm.component.html'
} )
export class DialogConfirmComponent {

	/**
	 * Internal: Change detector
	 */
	private changeDetector: ChangeDetectorRef;

	/**
	 * Internal: Dialog visibility status
	 */
	private isOpen: boolean;

	/**
	 * Internal: Dialog title
	 */
	private title: string;

	/**
	 * Internal: Dialog message
	 */
	private message: string;

	/**
	 * Internal: Dialog yes-button text
	 */
	private yesText: string;

	/**
	 * Internal: Dialog no-button text
	 */
	private noText: string;

	/**
	 * Internal: Dialog type
	 */
	private type: string;

	/**
	 * Promise resolve function
	 */
	private resolve: Function;

	/**
	 * Constructor
	 */
	constructor(
		changeDetector: ChangeDetectorRef,
		dialogConfirmService: DialogConfirmService
	) {

		// Initialize
		this.changeDetector = changeDetector;

		// Connect both requestConfirmation functions
		dialogConfirmService.requestConfirmation = this.requestConfirmation.bind( this );

		// Setup
		this.isOpen = false;
		this.title = 'Confirm';
		this.yesText = 'Yes';
		this.noText = 'No';
		this.message = '';
		this.type = 'primary';
		this.resolve = new Function();

	}

	/**
	 * Request confirmation from user via the dialog
	 * @param  {any}              options Options object
	 * @return {Promise<boolean>}         Promise, tells the result as a boolean value
	 */
	public requestConfirmation( options: any ): Promise<boolean> {

		// Setup content and open dialog
		this.openDialog( options );

		// Create and return the promise
		return new Promise<boolean>( ( resolve: Function ) => {
			this.resolve = resolve;
		} );

	}

	/**
	 * Open dialog
	 * @param {any} options Options object
	 */
	private openDialog( options: any ): void {

		// Set values
		this.title = options.title;
		this.yesText = options.yesText;
		this.noText = options.noText;
		this.message = options.message;
		this.type = options.type;
		this.isOpen = true;

		this.changeDetector.markForCheck(); // Trigger change detection

	}

	/**
	 * Close dialog
	 */
	private closeDialog(): void {

		// Close dialog
		this.isOpen = false;

		// Wait until the animation is done (takes 250ms)
		setTimeout(
			() => {

				// Reset values
				this.title = 'Confirm';
				this.yesText = 'Yes';
				this.noText = 'No';
				this.message = '';
				this.type = 'primary';
				this.changeDetector.markForCheck(); // Trigger change detection

			},
			300
		);

	}

	/**
	 * Confirm the confirmation request (by clicking yes)
	 */
	private onConfirm(): void {
		this.closeDialog();
		this.resolve( true );
	}

	/**
	 * Cancel the confirmation request (by clicking no)
	 */
	private onCancel(): void {
		this.closeDialog();
		this.resolve( false );
	}

}
