/**
 * External imports
 */
import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ROUTER_DIRECTIVES, Routes, Route, RouteSegment, RouteTree, Router, OnActivate } from '@angular/router';
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
import { BookmarkDirectoryComponent } from './../bookmark-directory/bookmark-directory.component';

/**
 * Bookmark components
 */
@Component( {
	changeDetection: ChangeDetectionStrategy.OnPush,
	directives: [
		ROUTER_DIRECTIVES,
		IconComponent,
		HeaderComponent,
		BookmarkListComponent,
		BookmarkDirectoryComponent
	],
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
	} )
] )
export class BookmarksComponent implements OnActivate, OnInit, OnDestroy {

	/**
	 * Router
	 */
	private router: Router;

	/**
	 * Current url segment
	 */
	private currentUrlSegment: RouteSegment;

	/**
	 * Change Detector
	 */
	private changeDetector: ChangeDetectorRef;

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
	 * List of all folders
	 */
	private folders: List<Folder>;

	/**
	 * ID of the currently opened folder
	 */
	private openedFolderId: number;

	/**
	 * Constructor
	 */
	constructor(
		router: Router,
		changeDetector: ChangeDetectorRef,
		uiService: UiService,
		bookmarkDataService: BookmarkDataService,
		folderDataService: FolderDataService,
		labelDataService: LabelDataService
		) {

		// Initialize services
		this.router = router;
		this.changeDetector = changeDetector;
		this.uiService = uiService;
		this.bookmarkDataService = bookmarkDataService;
		this.folderDataService = folderDataService;
		this.labelDataService = labelDataService;

		// Setup
		this.openedFolderId = null; // Explicitely not set yet
		this.serviceSubscriptions = [];

	}

	/**
	 * Call this when the router gets activated
	 * This function only handles stuff that has to do with routing
	 */
	public routerOnActivate(curr: RouteSegment, prev?: RouteSegment, currTree?: RouteTree, prevTree?: RouteTree): void {

		console.log('BOOKMARKS COMPONENT: ROUTER ACTIVATE'); // TODO: Remove me

		// Save current URL segment, needed for relative navigation later on
		this.currentUrlSegment = curr;

	}

	/**
	 * Call this when the view gets initialized
	 */
	public ngOnInit(): void {

		console.log('BOOKMARKS COMPONENT: ON INIT'); // TODO: Remove me

		// Get informed when the opened folder changes so that we can update the directory view
		// For example, this could come from the bookmark list component
		const uiServiceSubscription: Subscription = this.uiService.uiState.subscribe(
			( uiState: Map<string, any> ) => {

				// Update opened folder (only when the value actually changed)
				if ( uiState.get( 'openedFolderId' ) !== this.openedFolderId ) {
					this.openedFolderId = uiState.get( 'openedFolderId' );
					this.changeDetector.detectChanges(); // Detect changes
				}

			}
		);

		// Get folders from their services
		const folderServiceSubscription: Subscription = this.folderDataService.folders.subscribe(
			( folders: List<Folder> ) => {
				if ( folders.size > 0 ) {
					this.folders = folders;
					this.changeDetector.markForCheck(); // Mark for change detection
				}
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
			folderServiceSubscription
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
	private onSelectFolder(folderId: number): void {
		this.router.navigate( [ 'view', folderId ], this.currentUrlSegment ); // Relative navigation
	}

}
