/**
 * Bookmark list component
 */

/**
 * External imports
 */
import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ROUTER_DIRECTIVES, Router, Route, Routes, RouteSegment, RouteTree, OnActivate } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { List, Map } from 'immutable';

/**
 * Internal imports
 */
import { UiService } from './../../services/ui';
import { Bookmark, BookmarkDataService, BookmarkLogicService } from './../../services/bookmark';
import { Folder, FolderDataService, FolderLogicService } from './../../services/folder';
import { Label, LabelDataService } from './../../services/label';
import { NotifierService } from './../../shared/notifier/notifier.service';
import { LoginComponent } from './../login/login.component';
import { BookmarkDetailsComponent } from './../bookmark-details/bookmark-details.component';
import { FolderDetailsComponent } from './../folder-details/folder-details.component';
import { BookmarkComponent } from './../../shared/bookmark/bookmark.component';
import { FolderComponent } from './../../shared/folder/folder.component';
import { CreateBookmarkComponent } from './../../shared/create-bookmark/create-bookmark.component';
import { CreateFolderComponent } from './../../shared/create-folder/create-folder.component';
import { IconComponent } from './../../shared/icon/icon.component';

/**
 * View component (smart): Bookmark list
 */
@Component( {
	changeDetection: ChangeDetectionStrategy.OnPush,
	directives: [
		ROUTER_DIRECTIVES,
		BookmarkComponent,
		FolderComponent,
		CreateBookmarkComponent,
		CreateFolderComponent,
		IconComponent
	],
	host: {
		class: 'bookmark-list'
	},
	selector: 'app-bookmark-list',
	templateUrl: './bookmark-list.component.html'
} )
@Routes( [
	new Route( {
		component: BookmarkDetailsComponent,
		path: '/bookmark/:id'
	} ),
	new Route( {
		component: FolderDetailsComponent,
		path: '/folder/:id'
	} ),
	// Hacky 'otherwhise' functionality, redirects to bookmarks over login
	// We do this because of issues occuring when redirecting directly to the bookmarks route
	new Route( {
		component: LoginComponent,
		path: '*'
	} )
] )
export class BookmarkListComponent implements OnActivate, OnInit, OnDestroy {

	/**
	 * Router
	 */
	private router: Router;

	/**
	 * Change detector
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
	 * Bookmark logic service
	 */
	private bookmarkLogicService: BookmarkLogicService;

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
	 * Notifier service
	 */
	private notifierService: NotifierService;

	/**
	 * List containing all service subscriptions
	 */
	private serviceSubscriptions: Array<Subscription>;

	/**
	 * List of bookmarks
	 */
	private bookmarks: List<Bookmark>;

	/**
	 * List of folders
	 */
	private folders: List<Folder>;

	/**
	 * Map of labels
	 */
	private labels: Map<string, Label>;

	/**
	 * Bookmark template for a new bookmark
	 */
	private bookmarkTemplate: Bookmark;

	/**
	 * Folder template for a new folder
	 */
	private folderTemplate: Folder;

	/**
	 * ID of the currently opened folder
	 */
	private openedFolderId: string;

	/**
	 * Name of the currently opened folder
	 */
	private openedFolderName: string;

	/**
	 * Currently selected element details
	 */
	private selectedElement: {
		id: string,
		type: string
	};

	/**
	 * Constructor
	 */
	constructor(
		router: Router,
		changeDetector: ChangeDetectorRef,
		uiService: UiService,
		bookmarkDataService: BookmarkDataService,
		bookmarkLogicService: BookmarkLogicService,
		folderDataService: FolderDataService,
		folderLogicService: FolderLogicService,
		labelDataService: LabelDataService,
		notifierService: NotifierService
	) {

		// Initialize
		this.router = router;
		this.changeDetector = changeDetector;
		this.uiService = uiService;
		this.bookmarkDataService = bookmarkDataService;
		this.bookmarkLogicService = bookmarkLogicService;
		this.folderDataService = folderDataService;
		this.folderLogicService = folderLogicService;
		this.labelDataService = labelDataService;
		this.notifierService = notifierService;

		// Setup
		this.bookmarks = List<Bookmark>();
		this.folders = List<Folder>();
		this.labels = Map<string, Label>();
		this.bookmarkTemplate = <Bookmark> Map<string, any>();
		this.folderTemplate = <Folder> Map<string, any>();
		this.openedFolderId = null;
		this.openedFolderName = '';
		this.serviceSubscriptions = [];
		this.selectedElement = {
			id: null,
			type: null
		};

	}

	/**
	 * Call this when the router gets activated
	 * This function only handles stuff that has to do with routing
	 */
	public routerOnActivate( curr: RouteSegment, prev?: RouteSegment, currTree?: RouteTree, prevTree?: RouteTree ): void {

		// No matter what happens, reset search parameters when entering this route
		// This is much easier to do here because now it's in one place
		this.uiService.resetSearch();

		// Get folder ID from the route URL
		this.openedFolderId = curr.parameters[ 'id' ];

	}

	/**
	 * Call this when the view gets initialized
	 * We do NOT land here if we have been thrown out in the 'routerOnActive' function above
	 */
	public ngOnInit(): void {

		// Update UI state
		// This should notify other components, like the bookmark directory one
		this.uiService.setOpenedFolderId( this.openedFolderId );

		// Get informed when the selected element changes so that we can highlight the selected one in the list
		// For example, this could come from the bookmark details component
		const uiServiceSubscription: Subscription = this.uiService.uiState.subscribe(
			( uiState: Map<string, any> ) => {

				// Update selected element (only when the value actually changed)
				if ( uiState.getIn( [ 'selectedElement', 'id' ] ) !== this.selectedElement.id
					|| uiState.getIn( [ 'selectedElement', 'type' ] ) !== this.selectedElement.type ) {
					this.selectedElement.id = uiState.getIn( [ 'selectedElement', 'id' ] );
					this.selectedElement.type = uiState.getIn( [ 'selectedElement', 'type' ] );
				}

			}
		);

		// Get folders from its service
		const folderDataServiceSubscription: Subscription = this.folderDataService.folders.subscribe(
			( folders: List<Folder> ) => {
				if ( folders.size > 0 ) {

					// Check if the currently opened folder ID even exists, else navigate back to root
					let openedFolder: Folder = this.folderLogicService.getFolderByFolderId( folders, this.openedFolderId );
					if ( openedFolder !== null ) {
						this.folders = this.folderLogicService.getSubfoldersByFolderId( folders, this.openedFolderId );
						this.openedFolderName = openedFolder.get( 'isRoot' ) ? 'Bookmarks' : openedFolder.get( 'name' );
						this.uiService.setDocumentTitle( this.openedFolderName );
						this.changeDetector.markForCheck(); // Trigger change detection
					} else {
						this.navigateToFolder( null ); // Absolute, to the root folder
					}

				}
			}
		);

		// Get bookmarks from its service
		const bookmarkDataServiceSubscription: Subscription = this.bookmarkDataService.bookmarks.subscribe(
			( bookmarks: List<Bookmark> ) => {
				this.bookmarks = this.bookmarkLogicService.getBookmarksByFolderId( bookmarks, this.openedFolderId );
				this.changeDetector.markForCheck(); // Trigger change detection
			}
		);

		// Get labels from its service
		const labelDataServiceSubscription: Subscription = this.labelDataService.labels.subscribe(
			( labels: Map<string, Label> ) => {
				this.labels = labels;
				this.changeDetector.markForCheck(); // Trigger change detection
			}
		);

		// Set templates
		this.bookmarkTemplate = this.bookmarkDataService.getBookmarkTemplate();
		this.folderTemplate = this.folderDataService.getFolderTemplate();

		// Save subscriptions
		this.serviceSubscriptions = [
			bookmarkDataServiceSubscription,
			folderDataServiceSubscription,
			labelDataServiceSubscription,
			uiServiceSubscription
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
	 * Navigate to another route
	 * @param {string} folderId Name of the subfolder
	 */
	private navigateToFolder( folderId: string ): void {
		if ( folderId === null ) {
			this.uiService.unsetOpenedFolderId(); // Remove opened folder
			this.router.navigate( [ 'bookmarks' ] ); // Absolute, root folder
		} else {
			this.router.navigate( [ 'bookmarks', 'view', folderId ] ); // Absolute
		}
	}

	/**
	 * Open up details panel
	 * @param {string} elemntType Element Type
	 * @param {number} elementId  Element ID
	 */
	private onClickOnDetails( elementType: string, elementId: number ): void {
		this.router.navigate( [ 'bookmarks', 'view', this.openedFolderId, elementType, elementId ] ); // Absolute
	}

	/**
	 * Create new bookmark
	 * @param {any} newBookmark Bookmark data
	 */
	private onBookmarkCreate( newBookmark: any ): void {

		// Add more data first
		newBookmark.path = this.openedFolderId;
		newBookmark.position = this.bookmarks.size + 1; // Just append to the bookmark list

		// Try to create the bookmark
		this.bookmarkDataService.addBookmark( newBookmark )
			.then( ( data: any ) => {
				this.notifierService.notify( 'default', 'Bookmark successfully created.' );
			} )
			.catch( ( error: any ) => {
				this.notifierService.notify( 'default', 'An error occured while creating the bookmark.' );
			} );

	}

	/**
	 * Create new folder
	 * @param {any} newFolder Folder data
	 */
	private onFolderCreate( newFolder: any ): void {

		// Add more data first
		newFolder.path = this.openedFolderId;
		newFolder.position = this.folders.size + 1; // Just append to the folder list

		// Try to create the folder
		this.folderDataService.addFolder( newFolder )
			.then( ( data: any ) => {
				this.notifierService.notify( 'default', 'Folder successfully created.' );
			} )
			.catch( ( error: any ) => {
				this.notifierService.notify( 'default', 'An error occured while creating the folder.' );
			} );

	}

}
