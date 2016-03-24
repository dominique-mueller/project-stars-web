/**
 * External imports
 */
import { Injectable } from 'angular2/core';
import { Http, Response } from 'angular2/http';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/share';

/**
 * Internal imports
 */
import { AppService } from '../app/app.service';
import { Label } from './label.model';

/**
 * Exports
 */
export { Label } from './label.model';

/**
 * Label service
 */
@Injectable()
export class LabelService {

	/**
	 * Labels
	 */
	public labels: Observable<Label[]>;

	/**
	 * Lab lobserver
	 */
	private labelObserver: Observer<Label[]>;

	/**
	 * Label data store
	 */
	private labelStore: {
		labels: Label[]
	};

	/**
	 * Http service
	 */
	private http: Http;

	/**
	 * App service
	 */
	private appService: AppService;

	/**
	 * Details about ongoing requests (prevents multiple parallel requests)
	 */
	private isDoingHttpRequests: {
		get: boolean
	};

	/**
	 * Constructor
	 * @param {Http}       http       Http serfice
	 * @param {AppService} appService App service
	 */
	constructor( http: Http, appService: AppService ) {

		// Initialize services
		this.http = http;
		this.appService = appService;

		// Create label observable
		this.labels = new Observable( ( observer: Observer<Label[]> ) => {
			this.labelObserver = observer;
		} ).share(); // Make it hot

		// Setup label store
		this.labelStore = {
			labels: []
		};

		// Setup current http requests object
		this.isDoingHttpRequests = {
			get: false
		};

	}

	/**
	 * Get all labels
	 * @param {boolean = true} preferCached Per default cached values are prefered, but setting this to false will
	 * ensure that we're getting fresh data from the server
	 */
	public loadLabels( preferCached: boolean = true ): void {

		// Precalc number of labels
		let numberOfLabels: number = this.labelStore.labels.length;

		// Check 1:
		// Return cached labels first (no matter what you do, this will happen every time!)
		if ( numberOfLabels > 0 ) {
			this.labelObserver.next( this.labelStore.labels );
			this.labelObserver.complete();
		}

		// Check 2:
		// If someone is already requesting that data, the caller will get it via its subscription automatically
		if ( this.isDoingHttpRequests.get ) {
			return;
		}

		// Check 3:
		// Load fresh data from the server
		if ( !preferCached || numberOfLabels === 0 ) {

			// Start with http request
			this.isDoingHttpRequests.get = true;

			// Then we make the HTTP request
			this.http

				// Get data from API - TODO
				.get(`${this.appService.API_URL }/label.temp.json` )

				// Convert data
				.map( ( response: Response ) => <Label[]> response.json().data )

				// Subscription
				.subscribe(
					( data: Label[] ) => {

						// Update label store
						this.labelStore.labels = data;

						// Push to observable stream
						this.labelObserver.next( this.labelStore.labels );
						this.labelObserver.complete();

						// Done with http request
						this.isDoingHttpRequests.get = false;

					},
					( error: any ) => {

						// TODO: Service specific error handling
						console.log(error);
						this.labelObserver.error(error);

					}
				);

		}

	}

}
