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
		this.bookmarkService.bookmarks.subscribe(
			( data: Bookmark[] ) => {
				this.bookmarks = data;
				console.log( this.bookmarks ); // TODO
			},
			( error: any ) => {
				console.log( 'Component error message' );
			}
		);

		// Setup labels subscription
		this.labelService.labels.subscribe(
			( data: Label[] ) => {
				this.labels = data;
				console.log( this.labels ); // TODO
			},
			( error: any ) => {
				console.log( 'Component error message' );
			}
		);

		// Get all bookmarks
		this.bookmarkService.getBookmarks();

		// Get all labels
		this.labelService.getLabels();

	}

	/**
	 * Call this when the view gets destroyed
	 */
	public ngOnDestroy(): void {

		// Unsubscribe from services
		// this.bookmarkService.bookmarks.unsubscribe();

	}

}
