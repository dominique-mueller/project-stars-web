/**
 * External imports
 */
import { Component, ChangeDetectionStrategy } from '@angular/core';

/**
 * Internal imports
 */
import { IconComponent } from './../../shared/icon/icon.component';

/**
 * View component (smart): Login
 */
@Component( {
	changeDetection: ChangeDetectionStrategy.OnPush,
	directives: [
		IconComponent
	],
	host: {
		class: 'login'
	},
	selector: 'app-login',
	templateUrl: './login.component.html'
} )
export class LoginComponent {

	/**
	 * Constructor
	 */
	constructor() {

	}

}

