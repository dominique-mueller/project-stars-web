/**
 * External imports
 */
import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { ROUTER_DIRECTIVES, Routes, Route, RouteSegment, RouteTree, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { List, Map } from 'immutable';

/**
 * Internal imports
 */
import { UiService } from './../../services/ui';
import { BookmarkDataService } from './../../services/bookmark';
import { Folder, FolderDataService, FolderLogicService } from './../../services/folder';
import { LabelDataService } from './../../services/label';
import { IconComponent } from './../../shared/icon/icon.component';
import { HeaderComponent } from './../header/header.component';
import { BookmarkListComponent } from './../bookmark-list/bookmark-list.component';
import { BookmarkSearchComponent } from './../bookmark-search/bookmark-search.component';
import { BookmarkDirectoryComponent } from './../bookmark-directory/bookmark-directory.component';
import { LabelListComponent } from './../label-list/label-list.component';

/**
 * View component (smart): Bookmarks
 */
@Component( {
	changeDetection: ChangeDetectionStrategy.OnPush,
	directives: [
		ROUTER_DIRECTIVES,
		IconComponent,
		HeaderComponent,
		BookmarkListComponent,
		BookmarkSearchComponent,
		BookmarkDirectoryComponent,
		LabelListComponent
	],
	host: {
		class: 'bookmarks'
	},
	providers: [
		BookmarkDataService,
		FolderDataService,
		FolderLogicService,
		LabelDataService,
		UiService
	],
	selector: 'app-bookmarks',
	templateUrl: './bookmarks.component.html'
} )
@Routes( [
	new Route( {
		component: BookmarkListComponent,
		path: '/view/:id'
	} ),
	new Route( {
		component: BookmarkSearchComponent,
		path: '/search'
	} )
] )
export class BookmarksComponent implements OnInit, OnDestroy {

	/**
	 * Router
	 */
	private router: Router;

	/**
	 * UI service
	 */
	private uiService: UiService;

	/**
	 * Bookmark data service
	 */
	private bookmarkDataService: BookmarkDataService;

	/**
	 * Folder data service
	 */
	private folderDataService: FolderDataService;

	/**
	 * Label data service
	 */
	private labelDataService: LabelDataService;

	/**
	 * List containing all service subscriptions
	 */
	private serviceSubscriptions: Array<Subscription>;

	/**
	 * Folder list
	 */
	private folders: List<Folder>;

	/**
	 * ID of the currently opened folder
	 */
	private openedFolderId: number;

	/**
	 * Name of the currently opened folder
	 */
	private openedFolderName: string;

	/**
	 * Number of the currently opened tab
	 */
	private openedTab: number;

	/**
	 * Constructor
	 */
	constructor(
		router: Router,
		uiService: UiService,
		bookmarkDataService: BookmarkDataService,
		folderDataService: FolderDataService,
		folderLogicService: FolderLogicService,
		labelDataService: LabelDataService
		) {

		// Initialize
		this.router = router;
		this.uiService = uiService;
		this.bookmarkDataService = bookmarkDataService;
		this.folderDataService = folderDataService;
		this.labelDataService = labelDataService;

		// Setup
		this.serviceSubscriptions = [];
		this.folders = List<Folder>();
		this.openedFolderId = null;
		this.openedFolderName = '';
		this.openedTab = 0;

	}

	/**
	 * Call this when the view gets initialized
	 */
	public ngOnInit(): void {

		// Get informed when the opened folder changes so that we can update the directory view
		// For example, this could come from the bookmark list component
		const uiServiceSubscription: Subscription = this.uiService.uiState.subscribe(
			( uiState: Map<string, any> ) => {

				// Update opened folder (only when the value actually changed)
				if ( uiState.get( 'openedFolderId' ) !== this.openedFolderId ) {
					this.openedFolderId = uiState.get( 'openedFolderId' );
				}

			}
		);

		// Get folders from their services
		const folderDataServiceSubscription: Subscription = this.folderDataService.folders.subscribe(
			( folders: List<Folder> ) => {
				this.folders = folders;
			}
		);

		// Fetch initial data from server
		// We do this in the bookmarks component in order to prevent multiple requests at the same time
		this.folderDataService.loadFolders();
		this.bookmarkDataService.loadBookmarks();
		this.labelDataService.loadLabels();

		// Save subscriptions
		this.serviceSubscriptions = [
			uiServiceSubscription,
			folderDataServiceSubscription
		];

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
	 * Navigate to a folder (event comes from the directory)
	 * @param {number} folderId ID of the folder we want to navigate to
	 */
	private onSelectFolder( folderId: number ): void {

		// Update UI state
		// This should notify other components, like the bookmark list one
		this.uiService.unsetSelectedElement();

		// Navigate to folder (relative)
		this.router.navigate( [ 'bookmarks', 'view', folderId ] ); // Absolute

	}

	/**
	 * Open / switch to tab
	 * @param {number} tabId Number of the tab we want to show
	 */
	private onClickOnTab( tabId: number ): void {
		this.openedTab = tabId;
	}

	/**
	 * Navigate to the view or the search route when the saerch parameters change
	 * @param {any} searchParameters Search parameters object (already optimized)
	 */
	private onChangeSearch( searchParameters: any ): void {

		// Check if the search text is empty or not
		if ( searchParameters.text === '' ) {
			this.router.navigate( [ 'bookmarks', 'view', this.openedFolderId ] ); // Absolute, recently opened folder
		} else {
			this.router.navigate( [ 'bookmarks', 'search', searchParameters ] ); // Absolute, matrix search parameters
		}

	}

}
