/**
 * Imports
 */
import { Component, OnInit, OnDestroy } from 'angular2/core';
import { HTTP_PROVIDERS } from 'angular2/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
import { Subscription } from 'rxjs/Subscription';
import { HeaderComponent } from '../header/header.component';
import { BookmarkListComponent } from '../../components/bookmarkList/bookmarkList.component';
import { BookmarkService, Bookmark } from '../../services/bookmark/bookmark.service';
import { LabelService, Label } from '../../services/label/label.service';

/**
 * App Component
 */
@Component( {
	directives: [HeaderComponent, BookmarkListComponent],
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
	 * Service subscription
	 */
	private serviceSubscription: Subscription;

	/**
	 * Bookmarks
	 */
	private bookmarks: any[];
	private folders: any[];

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

		// Setup bookmark and label subscriptions
		this.serviceSubscription = Observable
		.forkJoin(
			this.bookmarkService.bookmarks,
			this.labelService.labels
		)
		.subscribe(
			( data: any[] ) => {
				this.bookmarks = data[0].bookmarks;
				this.folders = data[0].folders;
				this.labels = data[1];
				console.log( this.bookmarks ); // TODO
				// console.log( this.labels ); // TODO
			},
			( error: any ) => {
				console.log( 'Component error message' );
			}
		);

		// Get all bookmarks and labels
		this.bookmarkService.getBookmarks();
		this.labelService.getLabels();

	}

	/**
	 * Call this when the view gets destroyed
	 */
	public ngOnDestroy(): void {

		// Unsubscribe from services
		this.serviceSubscription.unsubscribe();

	}

}
