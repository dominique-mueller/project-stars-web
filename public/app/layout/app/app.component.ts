/**
 * Imports
 */
import { Component } from 'angular2/core';
import { IconComponent } from '../../shared/icon/icon.component';

/**
 * App Component
 */
@Component( {
	directives: [ IconComponent ],
	selector: 'app',
	templateUrl: './app.component.html'
} )
export class AppComponent {

	// TODO: Put them somewhere else (maybe a service?)
	private app: string = 'Project Stars';
	private name: string = 'John Doe';

}
