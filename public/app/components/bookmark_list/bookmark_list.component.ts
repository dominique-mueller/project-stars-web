/**
 * External imports
 */
import { Component, OnInit, OnDestroy } from 'angular2/core';
import { Router, RouteParams } from 'angular2/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/observable/combineLatest';

/**
 * Internal imports
 */
import { BookmarkService, IBookmark } from './../../services/bookmark/bookmark.service';
import { FolderService, IFolder } from './../../services/folder/folder.service';
import { IconComponent } from './../../shared/icon/icon.component';

/**
 * Bookmark list component
 */
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
	 * Label service
	 */
	private folderService: FolderService;

	/**
	 * Service subscription reference
	 */
	private serviceSubscription: Subscription;

	/**
	 * Bookmarks
	 */
	private bookmarks: IBookmark[];

	/**
	 * Folders
	 */
	private folders: IFolder[];

	/**
	 * Current folder path
	 */
	private currentPath: string;

	/**
	 * Constructor - TODO: Docs
	 */
	constructor(
		router: Router, routeParams: RouteParams,
		bookmarkService: BookmarkService, folderService: FolderService
	) {
		this.router = router;
		this.routeParams = routeParams;
		this.bookmarkService = bookmarkService;
		this.folderService = folderService;
	}

	/**
	 * Call this when the view gets initialized
	 */
	public ngOnInit(): void {

		// Get current route
		this.currentPath = ( this.routeParams.get( '*' ) || '' ).toLowerCase();

		// Get folders and bookmarks from their services
		this.serviceSubscription = Observable.combineLatest(
			this.folderService.folders,
			this.bookmarkService.bookmarks
		).subscribe(
			( data: any ) => {

				// Wait until we have all date (no fetching is going on any longer)
				if ( !this.folderService.isFetching && !this.bookmarkService.isFetching ) {

					// Get the current folder
					let currentFolder: IFolder = this.folderService.getFolderByPath( data[ 0 ], this.currentPath );

					// Error Handling:
					// Check if we were able to find the path, if not the path doesn't exist
					if ( typeof currentFolder === 'undefined' ) {
						this.router.navigateByUrl( 'bookmarks' ); // TODO: Show some notification?
					} else {

						// Get folders for this path
						this.folders = this.folderService.getFoldersByFolderId( data[ 0 ], currentFolder.id );

						// Get bookmarks for this path
						this.bookmarks = this.bookmarkService.getBookmarksByFolderId( data[ 1 ], currentFolder.id );

					}

				}

			},
			( error: any ) => {
				console.log('!! COMPONENT ERROR'); // TODO: Better error handling
				console.log(error);
			}
		);

	}

	/**
	 * Call this when the view gets destroyed
	 */
	public ngOnDestroy(): void {

		// Unsubscribe from all services (free resources)
		this.serviceSubscription.unsubscribe();

	}

	/**
	 * Navigate to another route
	 * @param {string} folderName Name of the subfolder
	 */
	private goToFolder( folderName: string ): void {

		// Create new route url, again special treatment for the root bookmarks folder here
		let routeUrl: string;
		if ( this.currentPath === '' ) {
			routeUrl = `bookmarks/${ folderName.toLowerCase() }`;
		} else {
			routeUrl = `bookmarks/${ this.currentPath }/${ folderName.toLowerCase() }`;
		}

		// Navigate to the created url
		this.router.navigateByUrl( routeUrl );

	}

}
