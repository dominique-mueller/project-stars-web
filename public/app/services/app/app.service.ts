/**
 * External imports
 */
import { Injectable } from 'angular2/core';

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
	 * Constructor
	 */
	constructor() {
		this.APP_NAME = 'Project Stars';
		this.API_URL = 'http://localhost:3000';
	}

}
