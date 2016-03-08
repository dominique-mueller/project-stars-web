/**
 * Imports
 */
import { Component } from 'angular2/core';
import { HeaderComponent } from '../header/header.component';

/**
 * App Component
 */
@Component( {
	directives: [ HeaderComponent ],
	selector: 'app',
	templateUrl: './app.component.html'
} )
export class AppComponent { }
