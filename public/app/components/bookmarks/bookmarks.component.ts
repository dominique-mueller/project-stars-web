/**
 * External imports
 */
import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { ROUTER_DIRECTIVES, Routes, Route, RouteSegment, RouteTree, Router, OnActivate } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { List, Map } from 'immutable';

/**
 * Internal imports
 */
import { UiService } from './../../services/ui';
import { BookmarkDataService, BookmarkLogicService } from './../../services/bookmark';
import { Folder, FolderDataService, FolderLogicService } from './../../services/folder';
import { LabelDataService } from './../../services/label';
import { UserDataService, UserAuthService } from './../../services/user';
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
		BookmarkLogicService,
		FolderDataService,
		FolderLogicService,
		LabelDataService,
		UiService,
		UserDataService
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
export class BookmarksComponent implements OnActivate, OnInit, OnDestroy {

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
	 * Folder logic service
	 */
	private folderLogicService: FolderLogicService;

	/**
	 * Label data service
	 */
	private labelDataService: LabelDataService;

	/**
	 * User data service
	 */
	private userDataService: UserDataService;

	/**
	 * User authentication service
	 */
	private userAuthService: UserAuthService;

	/**
	 * List containing all service subscriptions
	 */
	private serviceSubscriptions: Array<Subscription>;

	/**
	 * Folder list
	 */
	private folders: List<Folder>;

	/**
	 * ID of the root folder
	 */
	private rootFolderId: string;

	/**
	 * ID of the currently opened folder
	 */
	private openedFolderId: string;

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
		labelDataService: LabelDataService,
		userDataService: UserDataService,
		userAuthService: UserAuthService
	) {

		// Initialize
		this.router = router;
		this.uiService = uiService;
		this.bookmarkDataService = bookmarkDataService;
		this.folderDataService = folderDataService;
		this.folderLogicService = folderLogicService;
		this.labelDataService = labelDataService;
		this.userDataService = userDataService;
		this.userAuthService = userAuthService;

		// Setup
		this.serviceSubscriptions = [];
		this.folders = List<Folder>();
		this.rootFolderId = null; // Explicitely set to null
		this.openedFolderId = null; // Same as in the UI store
		this.openedFolderName = '';
		this.openedTab = 0; // Automatically show the folders tab

	}

	/**
	 * Call this when the router gets activated
	 * This function only handles stuff that has to do with routing
	 */
	public routerOnActivate( curr: RouteSegment, prev?: RouteSegment, currTree?: RouteTree, prevTree?: RouteTree ): void {

		// This route and all its subroutes are only available if the user is logged in
		// Else we redirect to the login page
		if ( !this.userAuthService.isUserLoggedIn() ) {
			this.router.navigate( [ 'login' ] ); // Absolute
		}

	}

	/**
	 * Call this when the view gets initialized
	 */
	public ngOnInit(): void {

		// Set title
		this.uiService.setDocumentTitle( 'Bookmarks' );

		// Get informed when the opened folder changes so that we can update the directory view
		// For example, this could come from the bookmark list component
		const uiServiceSubscription: Subscription = this.uiService.uiState.subscribe(
			( uiState: Map<string, any> ) => {

				// Update opened folder (only when the value actually changed)
				if ( uiState.get( 'openedFolderId' ) !== this.openedFolderId ) {
					this.openedFolderId = uiState.get( 'openedFolderId' );

					// We select the root folder when the opened folder gets unselected
					if ( this.openedFolderId === null ) {
						this.onSelectFolder( this.rootFolderId );
					}
				}

			}
		);

		// Get folders from their services
		const folderDataServiceSubscription: Subscription = this.folderDataService.folders.subscribe(
			( folders: List<Folder> ) => {
				if ( folders.size > 0 ) {

					// Set all folders
					this.folders = folders;

					// Find the root folder
					// If not yet done - this is only relevant for the first visit, to get into some folder (the root here)
					if ( this.rootFolderId === null ) {
						this.rootFolderId = this.folderLogicService.getRootFolder( folders ).get( 'id' );
						this.uiService.setRootFolderId( this.rootFolderId );
						this.onSelectFolder( this.rootFolderId );
					}

				}
			}
		);

		// Fetch initial data from server
		// We do this here to prevent multiple requests at the same time
		this.folderDataService.loadFolders();
		this.bookmarkDataService.loadBookmarks();
		this.labelDataService.loadLabels();
		this.userDataService.loadUser( this.userAuthService.getUserId() );

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
	 * Tabs: Switch to a tab
	 * @param {number} tabId Number of the tab we want to show
	 */
	private onClickOnTab(tabId: number): void {
		this.openedTab = tabId;
	}

	/**
	 * Navigate to a folder when selecting one in the bookmarks directory
	 * @param {string} folderId Folder ID
	 */
	private onSelectFolder( folderId: string ): void {

		// Set the opened folder RIGHT NOW - otherwise the directory just says 'well ... nope'
		this.openedFolderId = folderId;

		// Update UI state
		// This should notify other components, like the bookmark list one
		this.uiService.unsetSelectedElement();

		// Navigate to folder (relative)
		this.router.navigate( [ 'bookmarks', 'view', folderId ] ); // Absolute

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

	/**
	 * Log out request, coming from header
	 */
	private onLogout(): void {

		// Try to log the user out, then navigate to the login page
		this.userAuthService.logoutUser()

			// Success
			.then( ( data: any ) => {
				console.log( 'APP > Logout successful.' );
				this.router.navigate( [ 'login' ] ); // Absolute
			} )

			// Error
			.catch( ( error: any ) => {
				console.warn( 'APP > Logout not completely successful, only client-side.' );
				this.router.navigate( [ 'login' ] ); // Absolute
			} );

	}

}
