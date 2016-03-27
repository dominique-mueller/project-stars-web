/**
 * External imports
 */
import { Component, OnInit } from 'angular2/core';
import { RouteConfig, Router } from 'angular2/router';
import { Subscription } from 'rxjs/Subscription';

/**
 * Internal imports
 */
import { BookmarkService, IBookmark } from './../../services/bookmark/bookmark.service';
import { FolderService, IFolder } from './../../services/folder/folder.service';
import { LabelService } from './../../services/label/label.service';
import { IconComponent } from './../../shared/icon/icon.component';
import { HeaderComponent } from './../header/header.component';
import { BookmarkListComponent } from './../bookmark_list/bookmark_list.component';
import { BookmarkDirectoryComponent } from './../bookmark_directory/bookmark_directory.component';
import { BookmarkRouterOutlet } from './bookmarks.router';

/**
 * Bookmark components
 */
@Component( {
	directives: [
		IconComponent,
		HeaderComponent,
		BookmarkListComponent,
		BookmarkDirectoryComponent,
		BookmarkRouterOutlet
	],
	providers: [
		BookmarkService,
		FolderService,
		LabelService
	],
	selector: 'app-bookmarks',
	templateUrl: './bookmarks.component.html'
} )
@RouteConfig( [
	{
		component: BookmarkListComponent,
		path: '/',
		useAsDefault: true
	},
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
	 * Folder service
	 */
	private folderService: FolderService;

	/**
	 * Bookmarks
	 */
	private bookmarks: IBookmark[];

	/**
	 * Folders
	 */
	private folders: IFolder[];

	/**
	 * Service subscription
	 */
	// private serviceSubscription: Subscription;

	/**
	 * Folder structure
	 */
	// private folders: Directory[];

	/**
	 * Currently active path
	 */
	// private activePath: string[];

	/**
	 * Constructor
	 */
	constructor( router: Router, bookmarkService: BookmarkService, folderService: FolderService ) {
		this.router = router;
		this.bookmarkService = bookmarkService;
		this.folderService = folderService;
		// this.activePath = [ '' ];
	}

	/**
	 * Call this when the view gets initialized
	 */
	public ngOnInit(): void {

		// Fetch initial data from server
		this.folderService.loadFolders();
		this.bookmarkService.loadBookmarks();






		// TODO: Show a loading animation

		// Setup folder structure subscription
		// this.serviceSubscription = this.bookmarkService.bookmarks
		// 	.subscribe(
		// 		( data: Directory[] ) => {

		// 			// Set data (skip bookmark root folder)
		// 			this.folders = data[ 0 ].folders;

		// 		},
		// 		( error: any ) => {
		// 			console.log( 'Component error message' ); // TODO
		// 		}
		// 	);

		// Get folders
		// this.bookmarkService.loadBookmarks();

	}

	/**
	 * Navigate to the requested folder
	 * @param {string} path Path of the folder
	 */
	private goToFolder( path: string ): void {
		// this.router.navigateByUrl( `bookmarks/${ path.toLowerCase() }` );
	}

	/**
	 * Update current path for the directory view
	 * @param {string} path The all new current path
	 */
	private updateCurrentPath( path: string ): void {
		// this.activePath = path.split( '/' );
	}

	/**
	 * Search
	 */
	private search( searchParameters: any ): void {

		// Get current base path
		// let basePath: string = '';
		// if ( this.activePath[ 0 ].length !== 0 ) {
		// 	basePath = `/${ this.activePath.join('/') }`;
		// }

		// // Navigate to route, with or without search parameters
		// if ( searchParameters.value.length === 0 ) {
		// 	this.router.navigateByUrl( `bookmarks${ basePath }` );
		// } else {
		// 	this.router.navigateByUrl( `bookmarks${ basePath }/;value=${searchParameters.value}` );
		// }

	}

}
