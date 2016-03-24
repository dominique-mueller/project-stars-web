/**
 * External imports
 */
import { Component, OnInit, OnDestroy } from 'angular2/core';
import { Router, RouteParams } from 'angular2/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/observable/forkJoin';

/**
 * Internal imports
 */
import { BookmarkService, Directory, Bookmark } from '../../services/bookmark/bookmark.service';
import { LabelService, Label } from '../../services/label/label.service';
import { BookmarkSearchPipe } from './bookmark_search.pipe';
import { BookmarkFlatenPipe } from './bookmark_flaten.pipe';
import { IconComponent } from '../../shared/icon/icon.component';

/**
 * Bookmark list component
 */
@Component( {
	directives: [
		IconComponent
	],
	pipes: [
		BookmarkSearchPipe,
		BookmarkFlatenPipe
	],
	selector: 'app-bookmark-list',
	templateUrl: './bookmark_list.component.html'
} )
export class BookmarkListComponent implements OnInit, OnDestroy {

	/**
	 * Router service
	 */
	private router: Router;

	/**
	 * Route params service
	 */
	private routeParams: RouteParams;

	/**
	 * Bookmark service
	 */
	private bookmarkService: BookmarkService;

	/**
	 * Label service
	 */
	private labelService: LabelService;

	/**
	 * Service subcription
	 */
	private serviceSubscription: Subscription;

	/**
	 * Bookmarks
	 */
	private bookmarks: Bookmark[];

	/**
	 * Folders
	 */
	private folders: Directory[];

	/**
	 * Labels
	 */
	private labels: Label[];

	/**
	 * Current folder path
	 */
	private currentPath: string;

	/**
	 * Search value
	 */
	private searchValue: string;

	/**
	 * Constructor
	 * @param {Router}          router          Router service
	 * @param {RouteParams}     routeParams     Route params service
	 * @param {BookmarkService} bookmarkService Bookmark service
	 * @param {LabelService}    labelService    Label service
	 */
	constructor( router: Router, routeParams: RouteParams, bookmarkService: BookmarkService, labelService: LabelService ) {
		this.router = router;
		this.routeParams = routeParams;
		this.bookmarkService = bookmarkService;
		this.labelService = labelService;
		this.currentPath = '';
		this.searchValue = '';
	}

	/**
	 * Call this when the view gets initialized
	 */
	public ngOnInit(): void {

		// TODO: Show a loading / transition animation ?

		// Set path and search params
		if ( Object.keys( this.routeParams.params ).length > 0 ) {

			let routeParams: any = this.routeParams.get( '*' );
			if ( routeParams !== null ) {

				// One of the bookmark subfolders, maybe searching
				let splitParams: string[] = routeParams.split( '/;' );
				this.currentPath = splitParams[0];
				if ( splitParams.length > 1 ) {
					this.searchValue = splitParams[1].split('=')[1]; // TODO: Better split
				}

			} else {

				// Root bookmark folder, searching
				this.currentPath = '';
				this.searchValue = this.routeParams.get( 'value' ); // TODO: Refactoring

			}

		} else {

			// Root bookmarks folder, no searching
			this.currentPath = '';
			this.searchValue = '';

		}

		// Setup bookmarks subscription
		// TODO: Split this obervable
		this.serviceSubscription = Observable
			.forkJoin(
				this.bookmarkService.bookmarks,
				this.labelService.labels
			)
			.subscribe(
				( data: any[] ) => {

					console.log('### LABELS');
					console.log(data[ 1 ]);
					this.labels = data[ 1 ];

					// Get bookmarks depending on the current path, navigate to root on error
					this.bookmarkService.getBookmarksByPath( data[ 0 ], this.currentPath )
						.then( ( result: Directory ) => {
							this.bookmarks = result.bookmarks;
							this.folders = result.folders;
						} )
						.catch( () => {
							this.router.navigateByUrl( 'bookmarks' );
						} );

				},
				( error: any ) => {
					console.log( 'Component error message' ); // TODO
				}
			);

		// Load bookmarks and labels
		this.bookmarkService.loadBookmarks();
		this.labelService.loadLabels();

	}

	/**
	 * Call this when the view gets destroyed
	 */
	public ngOnDestroy(): void {

		// Unsubscribe from all services
		this.serviceSubscription.unsubscribe();

	}

	/**
	 * Navigate to another route
	 * @param {string} folderName Name of the subfolder
	 */
	private goToFolder( folderName: string ): void {

		// Create new router url (in lower case, of course)
		let url: string;
		if ( this.currentPath === '' ) {
			url = `bookmarks/${ folderName.toLowerCase() }`;
		} else {
			url = `bookmarks/${ this.currentPath }/${ folderName.toLowerCase() }`;
		}

		// Navigate to the created url
		this.router.navigateByUrl( url );

	}

}
