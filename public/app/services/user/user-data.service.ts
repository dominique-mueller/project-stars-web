/**
 * External imports
 */
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { AuthHttp } from 'angular2-jwt';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { Store, Action } from '@ngrx/store';

/**
 * Internal imports
 */
import { AppStore, AppService } from './../app';
import { UserAuthService } from './user-auth.service';
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
	 * Authenticated HTTP service
	 */
	private authHttp: AuthHttp;

	/**
	 * App service
	 */
	private appService: AppService;

	/**
	 * App store
	 */
	private store: Store<AppStore>;

	/**
	 * User authentication service
	 */
	private userAuthService: UserAuthService;

	/**
	 * Constructor
	 */
	constructor(
		authHttp: AuthHttp,
		appService: AppService,
		store: Store<AppStore>,
		userAuthService: UserAuthService
	) {

		// Initialize
		this.authHttp = authHttp;
		this.appService = appService;
		this.store = store;
		this.userAuthService = userAuthService;

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

				this.authHttp

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

		this.authHttp

			// Fetch data and parse response
			.get( `${ this.appService.API_URL }/users/${ this.userAuthService.getUserId() }` )
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
