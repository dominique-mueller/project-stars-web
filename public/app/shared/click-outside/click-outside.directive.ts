/**
 * External imports
 */
import { Directive, Output, EventEmitter } from '@angular/core';

/**
 * Shared directive: Click outside event
 */
@Directive( {
	host: {
		'(click)': 'trackEvent( $event )',
		'(document:click)': 'compareEvent( $event )'
	},
	selector: '[appClickOutside]'
} )
export class ClickOutsideDirective {

	/**
	 * Output: Click outside event, emitting the mouse event
	 * Sidenote: Attribute selector and output event are the same here
	 */
	@Output()
	private clickOutside: EventEmitter<MouseEvent>;

	/**
	 * Internal: Local event, contains the last internal click event
	 */
	private localEvent: any;

	/**
	 * Constructor
	 */
	constructor() {

		// Setup
		this.clickOutside = new EventEmitter<MouseEvent>();
		this.localEvent = null;

	}

	/**
	 * Track the local click event
	 * @param {MouseEvent} event Event object
	 */
	private trackEvent( event: MouseEvent ): void {

		// Set local event
		this.localEvent = event;

	}

	/**
	 * Compare the tracked local click event with the catched root click event
	 * @param {MouseEvent} event Event object
	 */
	private compareEvent( event: MouseEvent ): void {

		// Skip if the event catched on the document root is the same we tracked locally
		if ( event !== this.localEvent ) {
			this.clickOutside.emit( event );
		}

		// Reset local event
		this.localEvent = null;

	}

}
