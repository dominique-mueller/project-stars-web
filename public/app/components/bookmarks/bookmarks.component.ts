/**
 * External imports
 */
import { Component, OnInit, OnDestroy } from 'angular2/core';
import { RouteConfig, Router } from 'angular2/router';
import { Subscription } from 'rxjs/Subscription';

/**
 * Internal imports
 */
import { BookmarkService } from './../../services/bookmark/bookmark.service';
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
export class BookmarksComponent implements OnInit, OnDestroy {

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
	 * Label service
	 */
	private labelService: LabelService;

	/**
	 * Folders
	 */
	private folders: IFolder[];

	/**
	 * Service subscription
	 */
	private serviceSubscription: Subscription;

	/**
	 * Currently active folder id
	 */
	private activeFolderId: number;

	/**
	 * Constructor
	 * @param {Router}          router          Router service
	 * @param {BookmarkService} bookmarkService Bookmark service
	 * @param {FolderService}   folderService   Folder service
	 * @param {LabelService}    labelService    Label service
	 */
	constructor(
		router: Router,
		bookmarkService: BookmarkService, folderService: FolderService, labelService: LabelService
		) {

		// Initialize services
		this.router = router;
		this.bookmarkService = bookmarkService;
		this.folderService = folderService;
		this.labelService = labelService;

	}

	/**
	 * Call this when the view gets initialized
	 */
	public ngOnInit(): void {

		// Get folders and bookmarks from their services
		this.serviceSubscription = this.folderService.folders
			.subscribe(
				( data: any ) => {

					// Wait until we have all date (no fetching is going on any longer)
					if ( !this.folderService.isFetching ) {

						// Set folders
						this.folders = data;

					}

				},
				( error: any ) => {
					console.log('!! COMPONENT ERROR'); // TODO: Better error handling
					console.log(error);
				}
			);

		// Fetch initial data from server
		this.folderService.loadFolders();
		this.bookmarkService.loadBookmarks();
		this.labelService.loadLabels();

	}

	/**
	 * Call this when the view gets destroyed
	 */
	public ngOnDestroy(): void {

		// Unsubscribe from all services (free resources)
		this.serviceSubscription.unsubscribe();

	}

	/**
	 * Navigate to the requested folder (comes from directory)
	 * @param {number} folderId Id of the folder we want to navigate to
	 */
	private goToFolder( folderId: number ): void {

		// Update active folder id
		this.activeFolderId = folderId;

		// Calculate path to the selected folder
		let path: string = this.folderService.getPathByFolderId( this.folders, folderId );

		// Navigate to the folder (special treatment for the bookmarks root folder)
		if ( path.length === 0 ) {
			this.router.navigateByUrl( 'bookmarks' );
		} else {
			this.router.navigateByUrl( `bookmarks/${ path }` );
		}

	}

	/**
	 * Update current folder id (comes from list router outlet)
	 * @param {string} path Path of the folder we want to navigate to
	 */
	private updateActiveFolderId( path: string ): void {

		// Update active folder id - TODO: Pipe through state
		// this.activeFolderId = this.folderService.getFolderByPath( this.folders, path ).id;

	}

	/**
	 * Search
	 * @param {any} searchParameters All search options
	 */
	private search( searchParameters: any ): void {

		// Navigate to root, add search params
		if ( searchParameters.value.length === 0 ) {
			this.router.navigateByUrl( 'bookmarks' );
		} else {
			this.router.navigateByUrl( `bookmarks/;value=${ searchParameters.value }` );
		}

	}

}
