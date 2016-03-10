/**
 * Imports
 */
import { Injectable } from 'angular2/core';
import { Http, Response } from 'angular2/http';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/share';
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
	 * Constructor
	 * @param {Http} http Http service
	 */
	constructor( http: Http ) {

		// Initialize http service
		this.http = http;

		// Create the label observable
		this.labels = new Observable( ( observer: Observer<Label[]> ) => {
			this.labelObserver = observer;
		} ).share();

		// Setup label store
		this.labelStore = {
			labels: []
		};

	}

	/**
	 * Get all labels
	 */
	public getLabels(): void {

		this.http

			// Get data from API - TODO
			.get( 'label.temp.json' )

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

				},
				(error: any) => {

					// TODO: Service specific error handling
					console.log(error);
					this.labelObserver.error(error);

				}
			);

	}

}
