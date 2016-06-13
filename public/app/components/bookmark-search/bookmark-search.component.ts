/**
 * File: Bookmark search component
 */

import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Router, RouteSegment, RouteTree, OnActivate } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { List, Map } from 'immutable';

import { Bookmark, BookmarkDataService, BookmarkLogicService } from './../../services/bookmark';
import { Folder, FolderDataService, FolderLogicService } from './../../services/folder';
import { Label, LabelDataService } from './../../services/label';
import { UiService } from './../../services/ui';
import { BookmarkComponent, FolderComponent } from './../../shared';

/**
 * View component (smart): Bookmark search
 */
@Component( {
	changeDetection: ChangeDetectionStrategy.OnPush,
	directives: [
		BookmarkComponent,
		FolderComponent
	],
	host: {
		class: 'bookmark-search'
	},
	selector: 'app-bookmark-search',
	templateUrl: './bookmark-search.component.html'
} )
export class BookmarkSearchComponent implements OnActivate, OnInit, OnDestroy {

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
	 * List containing all service subscriptions
	 */
	private serviceSubscriptions: Array<Subscription>;

	/**
	 * List of filtered bookmarks
	 */
	private filteredBookmarks: List<Bookmark>;

	/**
	 * List of filtered folders
	 */
	private filteredFolders: List<Folder>;

	/**
	 * Map of labels
	 */
	private labels: Map<string, Label>;

	/**
	 * Search: Text
	 */
	private searchText: string;

	/**
	 * Constructor
	 * @param {Router}               router               Router
	 * @param {ChangeDetectorRef}    changeDetector       Change detector
	 * @param {UiService}            uiService            UI service
	 * @param {BookmarkDataService}  bookmarkDataService  Bookmark data service
	 * @param {BookmarkLogicService} bookmarkLogicService Bookmark logic service
	 * @param {FolderDataService}    folderDataService    Folder data service
	 * @param {FolderLogicService}   folderLogicService   Folder logic service
	 * @param {LabelDataService}     labelDataService     Label data service
	 */
	constructor(
		router: Router,
		changeDetector: ChangeDetectorRef,
		uiService: UiService,
		bookmarkDataService: BookmarkDataService,
		bookmarkLogicService: BookmarkLogicService,
		folderDataService: FolderDataService,
		folderLogicService: FolderLogicService,
		labelDataService: LabelDataService
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

		// Setup
		this.serviceSubscriptions = [];
		this.filteredBookmarks = List<Bookmark>();
		this.filteredFolders = List<Folder>();
		this.labels = Map<string, Label>();
		this.searchText = '';

	}

	/**
	 * Call this when the router gets activated (also everytime the search parameters change)
	 * This function only handles stuff that has to do with routing
	 */
	public routerOnActivate( curr: RouteSegment, prev?: RouteSegment, currTree?: RouteTree, prevTree?: RouteTree ): void {

		// Save search text
		if ( typeof curr.parameters[ 'text' ] !== undefined ) {
			this.searchText = curr.parameters[ 'text' ];
		}

		// Update search, necessary when calling this route directly / reloading
		this.uiService.setSearch( this.searchText );

	}

	/**
	 * Call this when the view gets initialized
	 */
	public ngOnInit(): void {

		this.uiService.setDocumentTitle( 'Search' );

		// Get folders from its service
		const folderDataServiceSubscription: Subscription = this.folderDataService.folders.subscribe(
			( folders: List<Folder> ) => {
				this.filteredFolders = this.folderLogicService.filterFolders( folders, this.searchText );
				this.changeDetector.markForCheck(); // Trigger change detection
			}
		);

		// Get bookmarks from its service
		const bookmarkDataServiceSubscription: Subscription = this.bookmarkDataService.bookmarks.subscribe(
			( bookmarks: List<Bookmark> ) => {
				this.filteredBookmarks = this.bookmarkLogicService.filterBookmarks( bookmarks, this.searchText );
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

		// Save subscriptions
		this.serviceSubscriptions = [
			bookmarkDataServiceSubscription,
			folderDataServiceSubscription,
			labelDataServiceSubscription
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
	 * Navigate to a folder when selecting (clicking on) it
	 * @param {string} folderId Folder ID
	 */
	private onSelectFolder( folderId: string ): void {
		this.router.navigate( [ 'bookmarks', 'view', folderId ] ); // Absolute
	}

	/**
	 * Navigate to a details panel when clicking on the details button
	 * @param {string} elementType    Element type
	 * @param {string} elementId      Element ID
	 * @param {string} parentFolderId ID of the parent folder
	 */
	private onClickOnDetails( elementType: string, elementId: string, parentFolderId: string ): void {
		this.router.navigate( [ 'bookmarks', 'view', parentFolderId, elementType, elementId ] ); // Absolute
	}

}
