/**
 * External imports
 */
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { AuthHttp, JwtHelper, tokenNotExpired } from 'angular2-jwt';

/**
 * Internal imports
 */
import { AppService } from './../app';

/**
 * User authentication service
 * Contains functions for authenticating the user, including login, logout
 * TODO: Register
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
	 * Check if the user is logged in
	 * This function checks that the JWT exists and is valid (expiration time) AS WELL AS check that the user ID is set
	 * @return {boolean} Status: true / false
	 */
	public isUserLoggedIn(): boolean {
		return tokenNotExpired( 'jwt' ) && localStorage.getItem( 'userId' ) !== null;
	}

	/**
	 * Get the current user ID (or null if it doesn't exist)
	 * @return {string} User ID
	 */
	public getUserId(): string {
		return localStorage.getItem( 'userId' );
	}

	/**
	 * API request: Log the user in, and save all authentication details
	 * @param {string} emailAddress    E-Mail address
	 * @param {string} password        Password
	 */
	public loginUser( emailAddress: string, password: string ): void {

		// TODO: This is only the dev text code, real code follows up
		setTimeout(
			() => {

				this.http

					// Fetch data and parse response
					.get( `${ this.appService.API_URL }/jwt.mock.json` )
					.map( ( response: Response ) => <any> response.json() )

					// Dispatch action
					.subscribe(
						( data: any ) => {

							// If the returned JWT is valid, safe it in the local storage
							if ( tokenNotExpired( 'jwt', data.data ) ) {
								this.saveAuthenticationDetails( data.data );
							} else {
								console.log('JWT IS INVALID');
								// TODO: Some error
							}

						}
					);

			},
			1000
		);

		/* TODO: This is the production code

		// Prepare data
		const authenticationData: any = {
			emailAddress: emailAddress,
			password: password
		};

		this.http

			// Fetch data and parse response
			.post( `${ this.appService.API_URL }/authenticate/login`, JSON.stringify( { data: authenticationData } ) )
			.map( ( response: Response ) => <any> response.json() )

			// Dispatch action
			.subscribe(
				( data: any ) => {

					// If the returned JWT is valid, safe it in the local storage
					if ( tokenNotExpired( 'jwt', data.data ) ) {
						this.saveAuthenticationDetails( data.data );
					} else {
						console.log('JWT IS INVALID');
						// TODO: Some error
					}

				},
				( error: any ) => {
					// TODO: Proper error handling
					console.error( 'USER SERVICE ERROR' );
					console.dir( error );
				}
			);

		*/

	}

	/**
	 * API request: Explicitely log the user out, and remove all authentication details
	 */
	public logoutUser(): void {

		// TODO: This is only the dev text code, real code follows up

		// Delete all authentication information
		this.deleteAuthenticationDetails();

		/* TODO: This is the production code

		this.authHttp

			// Fetch data and parse response
			.delete( `${ this.appService.API_URL }/authenticate/logout` )
			.map( ( response: Response ) => <any> response.json() )

			// Dispatch action
			.subscribe(
				( data: any ) => {

					// Delete all authentication information
					this.deleteAuthenticationDetails();

				},
				( error: any ) => {
					// TODO: Proper error handling
					console.error( 'USER SERVICE ERROR' );
					console.dir( error );
				}
			);

		*/

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
