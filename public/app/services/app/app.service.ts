/**
 * External imports
 */
import { Injectable } from '@angular/core';
import { List } from 'immutable';

/**
 * App service
 */
@Injectable()
export class AppService {

	/**
	 * APP NAME
	 */
	public APP_NAME: string;

	/**
	 * API URL
	 */
	public API_URL: string;

	/**
	 * COLOR PRESETS
	 * For example, used for label coloring
	 */
	public COLOR_PRESETS: List<string>;

	/**
	 * Constructor
	 */
	constructor() {

		// Setup
		this.APP_NAME = 'Project Stars';
		this.API_URL = 'http://localhost:3000/build/apimock';
		this.COLOR_PRESETS = List( [
			'#9E9E9E',
			'#F44336',
			'#448AFF',
			'#4CAF50',
			'#FF5722',
			'#607D8B',
			'#FF4081'
		] );

	}

}
