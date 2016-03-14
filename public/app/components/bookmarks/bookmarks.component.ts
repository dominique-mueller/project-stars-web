/**
 * Imports
 */
import { Component, OnInit } from 'angular2/core';
import { ROUTER_DIRECTIVES, RouteConfig, Router } from 'angular2/router';
import { Subscription } from 'rxjs/Subscription';
import { BookmarkService } from '../../services/bookmark/bookmark.service';
import { HeaderComponent } from '../header/header.component';
import { BookmarkListComponent } from '../../components/bookmarkList/bookmarkList.component';
import { BookmarkDirectoryComponent } from '../bookmarkDirectory/bookmarkDirectory.component';
import { BookmarkRouterOutlet } from '../bookmarkList/bookmarkList.router';

/**
 * Bookmark components
 */
@Component( {
	directives: [
		ROUTER_DIRECTIVES,
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
		path: '/**'
	}
] )
export class BookmarksComponent implements OnInit {

	/**
	 * Router
	 */
	private router: Router;

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
	private folders: any[];

	/**
	 * Currently active path
	 */
	private activePath: string[];

	/**
	 * Constructor
	 * @param {BookmarkService} bookmarkService Bookmark service
	 */
	constructor( router: Router, bookmarkService: BookmarkService ) {
		this.router = router;
		this.bookmarkService = bookmarkService;
	}

	/**
	 * Call this when the view gets initialized
	 */
	public ngOnInit(): void {

		// TODO: Show a loading animation

		// Setup folder structure subscription
		this.serviceSubscription = this.bookmarkService.bookmarks
			.subscribe(
				( data: any[] ) => {

					// Set data (skip bookmark root folder)
					this.folders = data[0].folders;

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

}
