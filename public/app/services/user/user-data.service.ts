/**
 * External imports
 */
import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { AuthHttp } from 'angular2-jwt';
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
 * TODO: Next steps would be: Create, update, delete users
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
	 * Constructor
	 */
	constructor(
		authHttp: AuthHttp,
		appService: AppService,
		store: Store<AppStore>
	) {

		// Initialize
		this.authHttp = authHttp;
		this.appService = appService;
		this.store = store;

		// Setup
		this.user = <Observable<User>> store.select( 'user' ); // Select returns an observable

	}

	/**
	 * Authenticated API request
	 * Load the user
	 * @param  {string}       userId User ID
	 * @return {Promise<any>}        Promise when done
	 */
	public loadUser( userId: string ): Promise<any> {

		return new Promise<any>( ( resolve: Function, reject: Function ) => {
			this.authHttp

				// Fetch data and parse response
				.get( `${ this.appService.API_URL }/users/${ userId }` )
				.map( ( response: Response ) => response.status !== 204 ? response.json() : null )

				// Dispatch action
				.subscribe(
					( data: any ) => {
						this.store.dispatch( {
							payload: data.data,
							type: LOAD_USER
						} );
						console.log( 'APP > User Data Service > User successfully loaded.' );
						resolve();
					},
					( error: any ) => {
						console.log( 'APP > User Data Service > Error while loading user.' );
						console.log( error );
						reject();
					}
				);
		} );

	}

}
