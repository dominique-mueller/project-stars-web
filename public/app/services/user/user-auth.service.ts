/**
 * File: User authentication service
 */

import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { AuthHttp, JwtHelper, tokenNotExpired } from 'angular2-jwt';

import { AppService } from './../app';

/**
 * User authentication service
 */
@Injectable()
export class UserAuthService {

	/**
	 * Default HTTP service
	 */
	private http: Http;

	/**
	 * Authenticated HTTP service
	 */
	private authHttp: AuthHttp;

	/**
	 * JWT helper
	 */
	private jwtHelper: JwtHelper;

	/**
	 * App service
	 */
	private appService: AppService;

	/**
	 * Constructor
	 * @param {Http}       http       Default HTTP service
	 * @param {AuthHttp}   authHttp   Authenticated HTTP service
	 * @param {JwtHelper}  jwtHelper  JWT helper
	 * @param {AppService} appService App service
	 */
	constructor(
		http: Http,
		authHttp: AuthHttp,
		jwtHelper: JwtHelper,
		appService: AppService
	) {

		// Initialize
		this.http = http;
		this.authHttp = authHttp;
		this.jwtHelper = jwtHelper;
		this.appService = appService;

	}

	/**
	 * Check if a user is logged in
	 * This function checks that the JWT exists and is valid (expiration time) AS WELL AS checks that the user ID is set
	 * @return {boolean} Status as a boolean result
	 */
	public isUserLoggedIn(): boolean {
		return tokenNotExpired( 'jwt' ) && localStorage.getItem( 'userId' ) !== null;
	}

	/**
	 * Check if a user is a goat
	 * @return {boolean} Goat status
	 */
	public isUserAGoat(): boolean {
		return !( +new Date() % 2 ); // Mystery goat calculations ...
	}

	/**
	 * Get the current user ID (or null if it doesn't exist)
	 * @return {string} User ID
	 */
	public getUserId(): string {
		return localStorage.getItem( 'userId' );
	}

	/**
	 * API request: Log the user in, receive a JWT and save all authentication details to the local storage
	 * @param  {string}       emailAddress E-Mail address
	 * @param  {string}       password     Password
	 * @return {Promise<any>}              Promise when done
	 */
	public loginUser( emailAddress: string, password: string ): Promise<any> {
		return new Promise<any>( ( resolve: Function, reject: Function ) => {

			// Prepare data
			const authData: any = {
				emailAddress: emailAddress,
				password: password
			};

			// Set request content type (because its only set for authenticated HTTP requests for now)
			const requestOptions: RequestOptions = new RequestOptions( {
				headers: new Headers( {
					'Content-Type': 'application/json'
				} )
			} );

			this.http
				.post(
					`${ this.appService.API_URL }/authenticate/login`,
					JSON.stringify( { data: authData } ),
					requestOptions
				)
				.map( ( response: Response ) => response.status !== 204 ? response.json().data : null )
				.subscribe(
					( data: any ) => {
						if ( tokenNotExpired( 'jwt', data ) ) {
							this.saveAuthenticationDetails( data );
							console.log( 'APP > User Authentication Service > User login successful. (JWT is valid)' );
							resolve();
						} else {
							console.log( 'APP > User Authentication Service > User login unsuccessful. (JWT is invalid)' );
							reject();
						}
					},
					( error: any ) => {
						console.log( 'APP > User Authentication Service > Error while logging in the user.' );
						console.log( error );
						reject();
					}
				);

		} );
	}

	/**
	 * API request: Log the user out, and remove all authentication details from the local storage
	 * @return {Promise<any>} Promise when done
	 */
	public logoutUser(): Promise<any> {
		return new Promise<any>( ( resolve: Function, reject: Function ) => {
			this.authHttp
				.delete( `${ this.appService.API_URL }/authenticate/logout` )
				.map( ( response: Response ) => response.status !== 204 ? response.json().data : null )
				.subscribe(
					( data: any ) => {
						this.deleteAuthenticationDetails();
						console.log( 'APP > User Authentication Service > User logout successful. (JWT deleted)' );
						resolve();
					},
					( error: any ) => {
						this.deleteAuthenticationDetails();
						console.log( 'APP > User Authentication Service > Error while logging out user.' );
						console.log( error );
						reject();
					}
				);
		} );
	}

	/**
	 * Save all authentication details (JWT, user ID) to the local storage
	 * Sidenote: Used in combination with the login functionality, therefore not public
	 * @param {string} jwt JSON Web token
	 */
	private saveAuthenticationDetails( jwt: string ): void {
		localStorage.setItem( 'jwt', jwt );
		localStorage.setItem( 'userId', this.jwtHelper.decodeToken( jwt ).userId );
	}

	/**
	 * Delete all authentication details (JWT, user ID) from the local storage
	 * Sidenote: Used in combination with the login functionality, therefore not public
	 */
	private deleteAuthenticationDetails(): void {
		localStorage.removeItem( 'jwt' );
		localStorage.removeItem( 'userId' );
	}

}
