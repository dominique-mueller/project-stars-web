/**
 * External imports
 */
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

/**
 * Internal imports
 */
import { NotifierService } from './notifier.service';
import { IconComponent } from './../icon/icon.component';

/**
 * Shared component: Notifier
 */
@Component( {
	changeDetection: ChangeDetectionStrategy.OnPush,
	directives: [
		IconComponent
	],
	host: {
		class: 'notifier',
		'[class.is-visible]': 'isOpen'
	},
	selector: 'app-notifier',
	templateUrl: './notifier.component.html'
} )
export class NotifierComponent {

	/**
	 * Internal: Change detector
	 */
	private changeDetector: ChangeDetectorRef;

	/**
	 * Internal: Notifier visibility status
	 */
	private isOpen: boolean;

	/**
	 * Internal: Type
	 */
	private type: string;

	/**
	 * Internal: Message
	 */
	private message: string;

	/**
	 * Constructor
	 */
	constructor(
		changeDetector: ChangeDetectorRef,
		notifierService: NotifierService
	) {

		// Initialize
		this.changeDetector = changeDetector;

		// Connect both notify functios
		notifierService.notify = this.notify.bind( this );

		// Setup
		this.isOpen = false;
		this.type = 'default';
		this.message = '';

	}

	/**
	 * Show notification
	 * @param {string} type    Notification type
	 * @param {string} message Notification message
	 */
	public notify( type: string, message: string ): void {

		this.openNotification( type, message );
		// TODO: Hide old one if open

	}

	/**
	 * Open the notification
	 * @param {string} type    Notification type
	 * @param {string} message Notification message
	 */
	public openNotification( type: string, message: string ): void {

		// Set values
		this.type = type;
		this.message = message;
		this.isOpen = true;

		this.changeDetector.markForCheck(); // Trigger change detection

		// TODO: Auto close after time

	}

	/**
	 * Close the notification
	 */
	public closeNotification(): void {

		// Close notification
		this.isOpen = false;

		// Wait until the animation is done (TODO: Time)
		setTimeout(
			() => {

				// Reset values
				this.type = 'default';
				this.message = '';
				this.changeDetector.markForCheck(); // Trigger change detection

			},
			300
		);

	}

}
