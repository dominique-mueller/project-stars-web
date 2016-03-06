/**
 * Imports
 */
import { Component, Input } from 'angular2/core';

/**
 * Icon Component
 */
@Component( {
	selector: 'app-icon',
	templateUrl: './icon.component.html'
} )
export class IconComponent {

	@Input()
	private name: string;

	@Input()
	private color: string = '#000';

	@Input()
	private size: number = 24;

	// TOOD: Extract into an service
	private icons: {} = {
		'dropdown': 'M7 10l5 5 5-5z'
	};

}
