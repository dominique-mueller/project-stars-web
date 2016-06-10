/**
 * External imports
 */
import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { AuthHttp, JwtHelper, tokenNotExpired } from 'angular2-jwt';

/**
 * Internal imports
 */
import { AppService } from './../app';

/**
 * User authentication service
 * Contains functions for authenticating the user, including login, logout
 * TODO: Next steps would be: Register / sign up, forgot password, login via third party service
 */
@Injectable()
export class UserAuthService {

	/**
	 * HTTP service
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
	 * @param {Http}       http       HTTP service
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
	 * Checks if the user is logged in
	 * This function checks that the JWT exists and is valid (expiration time) AS WELL AS checks that the user ID is set
	 * @return {boolean} Status: true / false
	 */
	public isUserLoggedIn(): boolean {
		return tokenNotExpired( 'jwt' ) && localStorage.getItem( 'userId' ) !== null;
	}

	/**
	 * Gets the current user ID (or null implicitely if it doesn't exist)
	 * @return {string} User ID
	 */
	public getUserId(): string {
		return localStorage.getItem( 'userId' );
	}

	/**
	 * Unauthenticated API request
	 * Logs the user in, receives a JWT and saves all authentication details to the local storage
	 * @param  {string}       emailAddress E-Mail address
	 * @param  {string}       password     Password
	 * @return {Promise<any>}              Promise when done
	 */
	public loginUser( emailAddress: string, password: string ): Promise<any> {

		return new Promise<any>( ( resolve: Function, reject: Function ) => {

			// Prepare data
			const authenticationData: any = {
				emailAddress: emailAddress,
				password: password
			};

			// Set request type explicitely (because its only set for authenticated HTTP requests)
			const options: RequestOptions = new RequestOptions( {
				headers: new Headers( {
					'Content-Type': 'application/json'
				} )
			} );

			this.http

				// Fetch data and parse response
				.post( `${ this.appService.API_URL }/authenticate/login`, JSON.stringify( { data: authenticationData } ), options )
				.map( ( response: Response ) => <any> response.json() )

				// Save authentication information
				.subscribe(
					( data: any ) => {

						// If the returned JWT is valid, safe it in the local storage
						if ( tokenNotExpired( 'jwt', data.data ) ) {
							this.saveAuthenticationDetails( data.data );
							console.log( 'APP > User Authentication Service > JWT is valid.' );
							resolve();
						} else {
							console.log( 'APP > User Authentication Service > JWT is invalid.' );
							reject();
						}

					},
					( error: any ) => {
						console.log( 'APP > User Authentication Service > Error while logging in user.' );
						console.log( error );
						reject();
					}
				);

		} );

	}

	/**
	 * Authenticated API request
	 * Explicitely log the user out, and remove all authentication details from the local storage
	 * @return {Promise<any>} Promise to tell we're done
	 */
	public logoutUser(): Promise<any> {

		return new Promise<any>( ( resolve: Function, reject: Function ) => {

			// resolve();
			// this.deleteAuthenticationDetails();

			this.authHttp

				// Fetch data and parse response
				.delete( `${ this.appService.API_URL }/authenticate/logout` )
				.map( ( response: Response ) => <any> response.json() )

				// Delete all authentication information
				.subscribe(
					( data: any ) => {
						this.deleteAuthenticationDetails();
						console.log( 'APP > User Authentication Service > JWT removed.' );
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
	 * Save all authentication details
	 * This saves the JWT as well as the current user ID to the local storage
	 * Sidenote: Used in combination with the login functionality, therefore not public
	 * @param {string} jwt JSON Web token
	 */
	private saveAuthenticationDetails( jwt: string ): void {
		localStorage.setItem( 'jwt', jwt );
		localStorage.setItem( 'userId', this.jwtHelper.decodeToken( jwt ).userId );
	}

	/**
	 * Delete all authentication details
	 * This deletes the JWT as well as the current user ID from the local storage
	 * Sidenote: Used in combination with the login functionality, therefore not public
	 */
	private deleteAuthenticationDetails(): void {
		localStorage.removeItem( 'jwt' );
		localStorage.removeItem( 'userId' );
	}

}
