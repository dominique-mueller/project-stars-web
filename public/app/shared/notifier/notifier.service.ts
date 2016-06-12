/**
 * File: Notifier service
 */

import { Injectable } from '@angular/core';

/**
 * Shared component service: Notifier
 */
@Injectable()
export class NotifierService {

	/**
	 * Notify function bridge
	 */
	public notify: ( type: string, message: string ) => void;

}
