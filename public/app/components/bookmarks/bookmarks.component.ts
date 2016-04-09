/**
 * External imports
 */
import { Component, OnInit, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy } from 'angular2/core';
import { ROUTER_DIRECTIVES, RouteConfig, Router } from 'angular2/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { List, Map } from 'immutable';

/**
 * Internal imports
 */
import { UiService } from './../../services/ui/ui.service';
import { BookmarkService } from './../../services/bookmark/bookmark.service';
import { FolderService } from './../../services/folder/folder.service';
import { LabelService } from './../../services/label/label.service';
import { IconComponent } from './../../shared/icon/icon.component';
import { HeaderComponent } from './../header/header.component';
import { BookmarkListComponent } from './../bookmarks/list/bookmark_list.component';
import { BookmarkDirectoryComponent } from './../bookmarks/directory/bookmark_directory.component';

/**
 * Bookmark components
 */
@Component( {
	directives: [
		ROUTER_DIRECTIVES,
		IconComponent,
		HeaderComponent,
		BookmarkListComponent,
		BookmarkDirectoryComponent
	],
	providers: [
		BookmarkService,
		FolderService,
		LabelService,
		UiService
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
	 * Change deterctor
	 */
	private changeDetectorRef: ChangeDetectorRef;

	/**
	 * Ui service
	 */
	private uiService: UiService;

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
	 * Folder map
	 */
	private folders: List<Map<string, any>>;

	/**
	 * Currently opened folder (id)
	 */
	private openedFolder: number;

	/**
	 * Service subscriptions
	 */
	private serviceSubscriptions: Array<Subscription>;

	/**
	 * Constructor
	 * @param {Router}          router          Router service
	 * @param {UiService}       uiService       UI service
	 * @param {BookmarkService} bookmarkService Bookmark service
	 * @param {FolderService}   folderService   Folder service
	 * @param {LabelService}    labelService    Label service
	 */
	constructor(
		router: Router, changeDetectorRef: ChangeDetectorRef, uiService: UiService,
		bookmarkService: BookmarkService, folderService: FolderService, labelService: LabelService
		) {

		// Initialize services
		this.router = router;
		this.changeDetectorRef = changeDetectorRef;
		this.uiService = uiService;
		this.bookmarkService = bookmarkService;
		this.folderService = folderService;
		this.labelService = labelService;

		// Setup
		this.openedFolder = null; // Root folder

	}

	/**
	 * Call this when the view gets initialized
	 */
	public ngOnInit(): void {

		// Get opened folder
		const uiServiceSubscription: Subscription = this.uiService.uiState.subscribe(
			( uiState: Map<string, any> ) => {

				// Update opened folder (only when the value actually changed)
				if ( uiState.get( 'openedFolder' ) !== this.openedFolder ) {

					// Update opened folder
					this.openedFolder = uiState.get( 'openedFolder' );
					this.changeDetectorRef.detectChanges(); // FIX

				}

			}
		);

		// Get folders and bookmarks from their services
		const folderServiceSubscription: Subscription = this.folderService.folders.subscribe(
			( folders: List<Map<string, any>> ) => this.folders = folders
		);

		// Save subscriptions
		this.serviceSubscriptions = [
			uiServiceSubscription,
			folderServiceSubscription
		];

		// Fetch initial data from server
		// We do this in the bookmarks component in order to prevent multiple requests at the same time
		this.folderService.loadFolders();
		this.bookmarkService.loadBookmarks();
		this.labelService.loadLabels();

	}

	/**
	 * Call this when the view gets destroyed
	 */
	public ngOnDestroy(): void {

		// Unsubscribe from all services (free resources manually)
		this.serviceSubscriptions.forEach( ( subscription: Subscription ) => {
			subscription.unsubscribe();
		} );

	}

	/**
	 * Navigate to the requested folder (comes from directory)
	 * @param {number} folderId Id of the folder we want to navigate to
	 */
	private goToFolder( folder: number ): void {

		// Update opened folder
		this.uiService.setOpenedFolder( folder );

		// Naviate to the folder
		let url: string = this.folderService.getPathByFolder(this.folders, folder);
		if (url.length === 0) {
			this.router.navigateByUrl('bookmarks');
		} else {
			this.router.navigateByUrl(`bookmarks/${url}`);
		}

	}

	/**
	 * Search
	 * @param {any} searchParameters All search options
	 */
	// private search( searchParameters: any ): void {

		// Navigate to root, add search params
		// if ( searchParameters.value.length === 0 ) {
		// 	this.router.navigateByUrl( 'bookmarks' );
		// } else {
		// 	this.router.navigateByUrl( `bookmarks/;value=${ searchParameters.value }` );
		// }

	// }

}
