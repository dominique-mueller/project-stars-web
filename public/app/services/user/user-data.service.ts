/**
 * External imports
 */
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { Store, Action } from '@ngrx/store';

/**
 * Internal imports
 */
import { AppStore, AppService } from './../app';
import { User } from './user.model';
import {
	LOAD_USER
} from './user.store';

/**
 * User data service
 * Contains functions for loading users
 * TODO: Create, update, delete users
 */
@Injectable()
export class UserDataService {

	/**
	 * Observable user
	 */
	public user: Observable<User>;

	/**
	 * HTTP service
	 */
	private http: Http;

	/**
	 * App service
	 */
	private appService: AppService;

	/**
	 * App store
	 */
	private store: Store<AppStore>;

	/**
	 * Constructor
	 */
	constructor(
		http: Http,
		appService: AppService,
		store: Store<AppStore>
	) {

		// Initialize
		this.http = http;
		this.appService = appService;
		this.store = store;

		// Setup
		this.user = store.select( 'user' ); // Select returns an observable

	}

	/**
	 * API request: Load the user
	 * @param {string} userId User ID
	 */
	public loadUser( userId: string ): void {

		// TODO: This is only the dev text code, real code follows up
		setTimeout(
			() => {

				this.http

					// Fetch data and parse response
					.get( `${ this.appService.API_URL}/user.mock.json` )
					.map( ( response: Response ) => <any> response.json() )

					// Dispatch action
					.subscribe(
						( data: any ) => {
							this.store.dispatch( {
								payload: data.data,
								type: LOAD_USER
							} );
						}
					);

			},
			1000
		);

		/* TODO: This is the production code

		this.http

			// Fetch data and parse response
			.get( `${ this.appService.API_URL }/users/${ userId }` )
			.map( ( response: Response ) => <any> response.json() )

			// Dispatch action
			.subscribe(
				( data: any ) => {
					this.store.dispatch( {
						payload: data.data,
						type: LOAD_USER
					} );
				},
				( error: any ) => {
					// TODO: Proper error handling
					console.error( 'USER SERVICE ERROR' );
					console.dir( error );
				}
			);

		*/

	}

}
