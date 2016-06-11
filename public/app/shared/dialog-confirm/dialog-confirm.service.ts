/**
 * File: Dialog confirm service
 */

import { Injectable } from '@angular/core';

/**
 * Shared component service: Dialog confirm
 */
@Injectable()
export class DialogConfirmService {

	/**
	 * Request confirmation function bridge, returning the result (yes/no) within a promise
	 */
	public requestConfirmation: ( options: any ) => Promise<boolean>;

}
