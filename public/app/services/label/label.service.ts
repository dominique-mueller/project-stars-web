/**
 * External imports
 */
import { Injectable } from 'angular2/core';
import { Http, Response } from 'angular2/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { Store, Action } from '@ngrx/store';

/**
 * Internal imports
 */
import { AppService } from './../app/app.service';
import { IAppStore } from './../app/app.store';
import { ILabel } from './label.model';
import { LOAD_LABELS } from './label.store';

/**
 * Exports
 */
export { ILabel } from './label.model';

/**
 * Label service
 */
@Injectable()
export class LabelService {

	/**
	 * Labels
	 */
	public labels: Observable<Map<string, Map<string, any>>>;

	/**
	 * Is fetching status flag
	 */
	public isFetching: boolean;

	/**
	 * Http service
	 */
	private http: Http;

	/**
	 * App service
	 */
	private appService: AppService;

	/**
	 * App store
	 */
	private store: Store<IAppStore>;

	/**
	 * Constructor
	 * @param {Http}             http       Http service
	 * @param {AppService}       appService App service
	 * @param {Store<IAppStore>} store      App store
	 */
	constructor( http: Http, appService: AppService, store: Store<IAppStore> ) {

		// Initialize services
		this.http = http;
		this.appService = appService;
		this.store = store;

		// Setup
		this.labels = store.select( 'labels' ); // Returns an observable
		this.isFetching = false;

	}

	/**
	 * Load labels from server
	 */
	public loadLabels(): void {

		this.isFetching = true;

		this.http

			// Fetch data from server
			.get( `${ this.appService.API_URL }/labels.mock.json` )

			// Convert data
			.map( ( response: Response ) => <ILabel[]> response.json().data )

			// Create action
			.map( ( payload: ILabel[] ) => ( { type: LOAD_LABELS, payload } ) )

			// Dispatch action
			.subscribe(
				( action: Action ) => {
					this.isFetching = false;
					this.store.dispatch( action );
				}
			);

			// TODO: Error handling

	}

}
