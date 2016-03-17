/**
 * External imports
 */
import { Component, OnInit } from 'angular2/core';
import { ROUTER_DIRECTIVES, RouteConfig, RouteParams, Router, Location } from 'angular2/router';
import { Subscription } from 'rxjs/Subscription';

/**
 * Internal imports
 */
import { BookmarkService, Directory } from '../../services/bookmark/bookmark.service';
import { IconComponent } from '../../shared/icon/icon.component';
import { HeaderComponent } from '../header/header.component';
import { BookmarkListComponent } from '../bookmark_list/bookmark_list.component';
import { BookmarkDirectoryComponent } from '../bookmark_directory/bookmark_directory.component';
import { BookmarkRouterOutlet } from './bookmarks.router';

/**
 * Bookmark components
 */
@Component( {
	directives: [
		ROUTER_DIRECTIVES,
		IconComponent,
		HeaderComponent,
		BookmarkListComponent,
		BookmarkDirectoryComponent,
		BookmarkRouterOutlet
	],
	providers: [
		BookmarkService
	],
	selector: 'app-bookmarks',
	templateUrl: './bookmarks.component.html'
} )
@RouteConfig( [
	{
		component: BookmarkListComponent,
		path: '/**',
		useAsDefault: true
	}
] )
export class BookmarksComponent implements OnInit {

	/**
	 * Router
	 */
	private router: Router;
	private routeParams: RouteParams;
	private location: Location;

	/**
	 * Bookmark service
	 */
	private bookmarkService: BookmarkService;

	/**
	 * Service subscription
	 */
	private serviceSubscription: Subscription;

	/**
	 * Folder structure
	 */
	private folders: Directory[];

	/**
	 * Currently active path
	 */
	private activePath: string[];

	/**
	 * Constructor
	 * @param {BookmarkService} bookmarkService Bookmark service
	 */
	constructor( router: Router, routeParams: RouteParams, location: Location, bookmarkService: BookmarkService ) {
		this.router = router;
		this.routeParams = routeParams;
		this.location = location;
		this.bookmarkService = bookmarkService;
		this.activePath = [ '' ];
	}

	/**
	 * Call this when the view gets initialized
	 */
	public ngOnInit(): void {

		// TODO: Show a loading animation

		// Setup folder structure subscription
		this.serviceSubscription = this.bookmarkService.bookmarks
			.subscribe(
				( data: Directory[] ) => {

					// Set data (skip bookmark root folder)
					this.folders = data[ 0 ].folders;

				},
				( error: any ) => {
					console.log( 'Component error message' ); // TODO
				}
			);

		// Get folders
		this.bookmarkService.loadBookmarks();

	}

	/**
	 * Navigate to the requested folder
	 * @param {string} path Path of the folder
	 */
	private goToFolder( path: string ): void {
		this.router.navigateByUrl( `bookmarks/${ path.toLowerCase() }` );
	}

	/**
	 * Update current path for the directory view
	 * @param {string} path The all new current path
	 */
	private updateCurrentPath( path: string ): void {
		this.activePath = path.split( '/' );
	}

	private search( searchParameters: any ): void {

		// Get current base path
		let currentPath: string = this.location.path().split( '/;' )[ 0 ];

		// Navigate
		if ( searchParameters.value.length === 0 ) {
			this.router.navigateByUrl( currentPath );
		} else {
			this.router.navigateByUrl( `${ currentPath }/;value=${ searchParameters.value }` );
		}

	}

}
