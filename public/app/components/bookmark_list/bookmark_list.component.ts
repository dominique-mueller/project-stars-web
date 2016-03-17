/**
 * External imports
 */
import { Component, OnInit, OnDestroy } from 'angular2/core';
import { Router, RouteParams, Location } from 'angular2/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/observable/forkJoin';

/**
 * Internal imports
 */
import { BookmarkService, Directory, Bookmark } from '../../services/bookmark/bookmark.service';
import { BookmarkSearchPipe } from './bookmark_search.pipe';
import { BookmarkFlatenPipe } from './bookmark_flaten.pipe';
import { IconComponent } from '../../shared/icon/icon.component';

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
	private location: Location;

	/**
	 * Bookmark service
	 */
	private bookmarkService: BookmarkService;

	/**
	 * Service subcription
	 */
	private serviceSubscription: Subscription;

	/**
	 * Current folder path
	 */
	private currentPath: string;

	/**
	 * Bookmarks
	 */
	private bookmarks: Bookmark[];

	/**
	 * Folders
	 */
	private folders: Directory[];

	private searchValue: string;

	/**
	 * Constructor
	 * @param {Router}          router          Router service
	 * @param {RouteParams}     routeParams     Route params service
	 * @param {BookmarkService} bookmarkService Bookmark service
	 */
	constructor( router: Router, routeParams: RouteParams, location: Location, bookmarkService: BookmarkService ) {
		this.router = router;
		this.routeParams = routeParams;
		this.location = location;
		this.bookmarkService = bookmarkService;
		this.currentPath = '';
		this.searchValue = '';
	}

	/**
	 * Call this when the view gets initialized
	 */
	public ngOnInit(): void {

		// TODO: Show a loading / transition animation ?

		// Get the current route url from the route params
		let routeParams: any = this.routeParams.get( '*' ); // This can either be null or a string

		// Set path and search value
		if ( routeParams !== null ) {

			// Check if we search and are on the root folder
			if ( routeParams.charAt( 0 ) === ';' ) {

				routeParams = routeParams.substring( 1 );
				this.searchValue = routeParams.split( '=' )[ 1 ];

			} else {

				// Split params into url and search params
				let splitParams: string[] = routeParams.split( '/;' );

				// Check if we are in the bookmarks root folder
				if ( splitParams.length > 1 ) {
					this.currentPath = splitParams[ 0 ];
					this.searchValue = splitParams[ 1 ].split( '=' )[ 1 ]; // TODO: Better split
				} else {
					this.currentPath = splitParams[ 0 ];
					this.searchValue = ''; // TODO: Better split
				}

			}

		}

		// Setup bookmarks subscription
		this.serviceSubscription = Observable
			.forkJoin(
				this.bookmarkService.bookmarks
			)
			.subscribe(
				( data: Array<Directory[]> ) => {

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

		// Load bookmarks
		this.bookmarkService.loadBookmarks();

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
