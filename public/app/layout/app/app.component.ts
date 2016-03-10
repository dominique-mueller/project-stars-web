/**
 * Imports
 */
import { Component, OnInit, OnDestroy } from 'angular2/core';
import { HTTP_PROVIDERS } from 'angular2/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
import { Subscription } from 'rxjs/Subscription';
import { HeaderComponent } from '../header/header.component';
import { BookmarkService, Bookmark } from '../../services/bookmark/bookmark.service';
import { LabelService, Label } from '../../services/label/label.service';

/**
 * App Component
 */
@Component( {
	directives: [ HeaderComponent ],
	providers: [ HTTP_PROVIDERS, BookmarkService, LabelService ],
	selector: 'app',
	templateUrl: './app.component.html'
} )
export class AppComponent implements OnInit, OnDestroy {

	/**
	 * Bookmark service
	 */
	private bookmarkService: BookmarkService;

	/**
	 * Label service
	 */
	private labelService: LabelService;

	/**
	 * Bookmark service scubscription
	 */
	private serviceSubscription: Subscription;

	/**
	 * Bookmarks
	 */
	private bookmarks: Bookmark[];

	/**
	 * Labels
	 */
	private labels: Label[];

	/**
	 * Constructor
	 * @param {BookmarkService} bookmarkService Bookmark service
	 */
	constructor( bookmarkService: BookmarkService, labelService: LabelService ) {
		this.bookmarkService = bookmarkService;
		this.labelService = labelService;
	}

	/**
	 * Call this when the view gets initialized
	 * TODO: Some kind of spinner thing, maybe better in the service?
	 */
	public ngOnInit(): void {

		// Setup bookmarks subscription
		this.bookmarkService.bookmarks.subscribe( ( data: Bookmark[] ) => {
			this.bookmarks = data;
			console.log (this.bookmarks );
		} );

		// Setup labels subscription
		this.labelService.labels.subscribe( ( data: Label[] ) => {
			this.labels = data;
			console.log( this.labels );
		} );

		// Get all bookmarks
		this.bookmarkService.getBookmarks();

		// Get all labels
		this.labelService.getLabels();

		// Get all bookmarks by subscribing to the service
		// this.serviceSubscription = Observable.forkJoin(
		// 	this.bookmarkService.getBookmarks(),
		// 	this.labelService.getLabels()
		// );
		// .subscribe(
		// 	( data: any[] ) => {
		// 		this.bookmarks = data[0];
		// 		console.log( this.bookmarks );
		// 		this.labels = data[1];
		// 		console.log( this.labels );
		// 	},
		// 	(error: any) => {
		// 		alert( 'Opps, something went terribly wrong.' ); // Please some proper error handling
		// 		console.log( error );
		// 	}
		// );

	}

	/**
	 * Call this when the view gets destroyed
	 */
	public ngOnDestroy(): void {

		// Unsubscribe from the bookmark service
		this.serviceSubscription.unsubscribe();

	}

}
