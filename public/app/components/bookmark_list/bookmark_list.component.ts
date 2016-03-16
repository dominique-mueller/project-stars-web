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
import { IconComponent } from '../../shared/icon/icon.component';

@Component( {
	directives: [
		IconComponent
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

	/**
	 * Constructor
	 * @param {Router}          router          Router service
	 * @param {RouteParams}     routeParams     Route params service
	 * @param {BookmarkService} bookmarkService Bookmark service
	 */
	constructor( router: Router, routeParams: RouteParams, bookmarkService: BookmarkService ) {
		this.router = router;
		this.routeParams = routeParams;
		this.bookmarkService = bookmarkService;
	}

	/**
	 * Call this when the view gets initialized
	 */
	public ngOnInit(): void {

		// TODO: Show a loading / transition animation

		// Setup bookmarks subscription
		this.serviceSubscription = Observable
			.forkJoin(
				this.bookmarkService.bookmarks
			)
			.subscribe(
				( data: Array<Directory[]> ) => {

					// Get the current route url from the route params
					let routeParam: string = this.routeParams.get( '*' ); // This can either be null or a string
					if ( routeParam === null ) {
						this.currentPath = '';
					} else {
						this.currentPath = routeParam;
					}

					// Get bookmarks depending on the current path, navigate to root on error
					this.bookmarkService.getBookmarksByPath(data[0], this.currentPath)
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
