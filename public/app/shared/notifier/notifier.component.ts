/**
 * File: Notifier component
 */

import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

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
		'[class.is-default]': 'type === \'default\'',
		'[class.is-success]': 'type === \'success\'',
		'[class.is-error]': 'type === \'error\'',
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
	 * Internal: Timeout token ID (for resetting)
	 */
	private timerToken: number;

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
	 * @param {ChangeDetectorRef} changeDetector  Change detector
	 * @param {NotifierService}   notifierService Notifier service
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
		this.timerToken = null;
		this.type = 'default';
		this.message = '';

	}

	/**
	 * Show notification
	 * @param {string} type    Notification type
	 * @param {string} message Notification message
	 */
	public notify( type: string, message: string ): void {
		if ( this.isOpen ) {
			this.closeNotification();
			setTimeout(
				() => {
					this.openNotification( type, message );
				},
				500 // Animation out takes 400ms, but give it some time between
			);
		} else {
			this.openNotification( type, message );
		}
	}

	/**
	 * Open the notification
	 * @param {string} type    Notification type
	 * @param {string} message Notification message
	 */
	public openNotification( type: string, message: string ): void {
		this.type = type;
		this.message = message;
		this.isOpen = true;
		this.changeDetector.markForCheck(); // Trigger change detection
		this.timerToken = setTimeout(
			() => {
				this.closeNotification();
			},
			7000
		);
	}

	/**
	 * Close the notification
	 */
	public closeNotification(): void {
		if ( this.timerToken !== null ) {
			clearTimeout( this.timerToken );
			this.timerToken = null;
		}
		this.isOpen = false;
		setTimeout(
			() => {
				this.type = 'default';
				this.message = '';
				this.changeDetector.markForCheck(); // Trigger change detection
			},
			400 // Animation out takes 400ms
		);
	}

}
