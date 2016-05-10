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
import { BookmarkComponent } from './../../shared/bookmark/bookmark.component';
import { FolderComponent } from './../../shared/folder/folder.component';

/**
 * Bookmark list component (smart)
 */
@Component( {
	changeDetection: ChangeDetectionStrategy.OnPush,
	directives: [
		ROUTER_DIRECTIVES,
		BookmarkComponent,
		FolderComponent,
		BookmarkDetailsComponent
	],
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
	} )
	// TODO: Path for folder details + component
] )
export class BookmarkListComponent implements OnActivate, OnInit, OnDestroy {

	/**
	 * Router service
	 */
	private router: Router;

	/**
	 * Current url segment
	 */
	private currentUrlSegment: RouteSegment;

	/**
	 * Change detector
	 */
	private changeDetector: ChangeDetectorRef;

	/**
	 * Ui service
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
	 * Service subscriptions
	 */
	private serviceSubscriptions: Array<Subscription>;

	/**
	 * Bookmarks
	 */
	private bookmarks: List<Bookmark>;

	/**
	 * Folders
	 */
	private folders: List<Folder>;

	/**
	 * Labels
	 */
	private labels: Map<string, Label>;

	/**
	 * ID of the currently opened folder
	 */
	private openedFolderId: number;

	/**
	 * Currently selected element
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

		// Initialize services
		this.router = router;
		this.changeDetector = changeDetector;
		this.uiService = uiService;
		this.bookmarkDataService = bookmarkDataService;
		this.bookmarkLogicService = bookmarkLogicService;
		this.folderDataService = folderDataService;
		this.folderLogicService = folderLogicService;
		this.labelDataService = labelDataService;

		// Setup
		this.openedFolderId = null; // Explicitely not set yet
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

		console.log('BOOKMARK LIST: ROUTER ACTIVATE'); // TODO: Remove me

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

		console.log('BOOKMARK LIST: ON INIT'); // TODO: Remove me

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
		const folderServiceSubscription: Subscription = this.folderDataService.folders.subscribe(
			( folders: List<Folder> ) => {
				if ( folders.size > 0 ) {

					// Check if the currently opened folder ID even exists, else navigate back to root
					if ( this.folderLogicService.getFolderByFolderId( folders, this.openedFolderId ) !== null ) {
						this.folders = this.folderLogicService.getSubfoldersByFolderId( folders, this.openedFolderId );
						this.changeDetector.markForCheck(); // Trigger change detection
					} else {
						this.navigateToFolder( 0 );
					}

				}
			}
		);

		// Get bookmarks from its service
		const bookmarkServiceSubscription: Subscription = this.bookmarkDataService.bookmarks.subscribe(
			( bookmarks: List<Bookmark> ) => {
				this.bookmarks = this.bookmarkLogicService.getBookmarksByFolderId( bookmarks, this.openedFolderId );
				this.changeDetector.markForCheck(); // Trigger change detection
			}
		);

		// Get labels from its service
		const labelServiceSubscription: Subscription = this.labelDataService.labels.subscribe(
			( labels: Map<string, Label> ) => {
				this.labels = labels;
				this.changeDetector.markForCheck(); // Trigger change detection
			}
		);

		// Save subscriptions
		this.serviceSubscriptions = [
			bookmarkServiceSubscription,
			folderServiceSubscription,
			labelServiceSubscription,
			uiServiceSubscription
		];

	}

	/**
	 * Call this when the view gets destroyed
	 */
	public ngOnDestroy(): void {

		console.log('BOOKMARK LIST: ON DESTROY'); // TODO: Remove me

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


	private onClickOnDetails( type: string, elementId: number ): void {
		this.router.navigate( [ type, elementId ], this.currentUrlSegment );
	}

}
