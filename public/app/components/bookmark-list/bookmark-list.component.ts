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
	providers: [
		BookmarkLogicService
	],
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
	} )
] )
export class BookmarkListComponent implements OnActivate, OnInit, OnDestroy {

	/**
	 * Router
	 */
	private router: Router;

	/**
	 * Current URL segment
	 */
	private currentUrlSegment: RouteSegment;

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
	private labels: Map<number, Label>;

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
	private openedFolderId: number;

	/**
	 * Name of the currently opened folder
	 * TODO: Maybe show breadscrumbs instead?
	 */
	private openedFolderName: string;

	/**
	 * Currently selected element details
	 */
	private selectedElement: {
		id: number,
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
		labelDataService: LabelDataService ) {

		// Initialize
		this.router = router;
		this.changeDetector = changeDetector;
		this.uiService = uiService;
		this.bookmarkDataService = bookmarkDataService;
		this.bookmarkLogicService = bookmarkLogicService;
		this.folderDataService = folderDataService;
		this.folderLogicService = folderLogicService;
		this.labelDataService = labelDataService;

		// Setup
		this.bookmarks = List<Bookmark>();
		this.folders = List<Folder>();
		this.labels = Map<number, Label>();
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

		// Save current URL segment, needed for relative navigation later on
		this.currentUrlSegment = curr;

		// Get folder ID from the route URL
		// Pre-filter: If the ID is not a number, we navigate back to the root folder
		if ( /^\d+$/.test( curr.parameters[ 'id' ] ) ) {
			this.openedFolderId = parseInt( curr.parameters[ 'id' ], 10 );
		} else {
			this.navigateToFolder( 0 );
		}

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
					this.changeDetector.markForCheck(); // Trigger change detection
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
						this.openedFolderName = openedFolder.get( 'name' );
						this.changeDetector.markForCheck(); // Trigger change detection
					} else {
						this.navigateToFolder( 0 );
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
			( labels: Map<number, Label> ) => {
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
	 * @param {number} folderId Name of the subfolder
	 */
	private navigateToFolder( folderId: number ): void {
		// this.router.navigate( [ `../${ folderId }` ], this.currentUrlSegment ); // TODO: Sometimes an error gets thrown
		this.router.navigateByUrl( `/bookmarks/view/${ folderId }` );
	}

	/**
	 * Open up details panel
	 * @param {string} elemntType Element Type
	 * @param {number} elementId  Element ID
	 */
	private onClickOnDetails( elementType: string, elementId: number ): void {
		this.router.navigate( [ elementType, elementId ], this.currentUrlSegment );
	}

	/**
	 * Create new bookmark
	 * @param {any} data Bookmark data
	 */
	private onCreateBookmark( data: any ): void {

		// Add additional data to bookmark
		data.path = this.openedFolderId;
		data.position = this.bookmarks.size + 1;

		// Save
		this.bookmarkDataService.addBookmark( data );

	}

	/**
	 * Create new folder
	 * @param {any} data Folder data
	 */
	private onCreateFolder( data: any ): void {

		// Add additional data to folder
		data.path = this.openedFolderId;
		data.position = this.folders.size + 1;

		// Save
		this.folderDataService.addFolder( data );

	}

}
