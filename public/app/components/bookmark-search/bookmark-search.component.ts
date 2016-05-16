/**
 * External imports
 */
import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Router, RouteSegment, RouteTree, OnActivate } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { List, Map } from 'immutable';

/**
 * Internal imports
 */
import { UiService } from './../../services/ui';
import { Bookmark, BookmarkDataService } from './../../services/bookmark';
import { Folder, FolderDataService } from './../../services/folder';
import { Label, LabelDataService } from './../../services/label';
import { FilterBookmarksPipe } from './../../pipes/filter-bookmarks.pipe';
import { FilterFoldersPipe } from './../../pipes/filter-folders.pipe';
import { BookmarkComponent } from './../../shared/bookmark/bookmark.component';
import { FolderComponent } from './../../shared/folder/folder.component';

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
	pipes: [
		FilterBookmarksPipe,
		FilterFoldersPipe
	],
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
	 * Search: Text
	 */
	private searchText: string;

	/**
	 * Constructor
	 */
	constructor(
		router: Router,
		changeDetector: ChangeDetectorRef,
		uiService: UiService,
		bookmarkDataService: BookmarkDataService,
		folderDataService: FolderDataService,
		labelDataService: LabelDataService ) {

		// Initialize
		this.router = router;
		this.changeDetector = changeDetector;
		this.uiService = uiService;
		this.bookmarkDataService = bookmarkDataService;
		this.folderDataService = folderDataService;
		this.labelDataService = labelDataService;

		// Setup
		this.serviceSubscriptions = [];
		this.bookmarks = List<Bookmark>();
		this.folders = List<Folder>();
		this.labels = Map<number, Label>();
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

		// Get folders from its service
		const folderDataServiceSubscription: Subscription = this.folderDataService.folders.subscribe(
			( folders: List<Folder> ) => {
				if ( folders.size > 0 ) {
					this.folders = folders;
					this.changeDetector.markForCheck(); // Trigger change detection
				}
			}
		);

		// Get bookmarks from its service
		const bookmarkDataServiceSubscription: Subscription = this.bookmarkDataService.bookmarks.subscribe(
			( bookmarks: List<Bookmark> ) => {
				if ( bookmarks.size > 0 ) {
					this.bookmarks = bookmarks;
					this.changeDetector.markForCheck(); // Trigger change detection
				}
			}
		);

		// Get labels from its service
		const labelDataServiceSubscription: Subscription = this.labelDataService.labels.subscribe(
			( labels: Map<number, Label> ) => {
				if ( labels.size > 0 ) {
					this.labels = labels;
					this.changeDetector.markForCheck(); // Trigger change detection
				}
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
	 * @param {number} folderId Folder ID
	 */
	private onSelectFolder( folderId: number ): void {
		this.router.navigate( [ 'bookmarks', 'view', folderId ] ); // Absolute
	}

	/**
	 * Navigate to a details panel when clicking on the details button
	 * @param {string} elementType    Element type
	 * @param {number} elementId      Element ID
	 * @param {number} parentFolderId ID of the parent folder
	 */
	private onClickOnDetails( elementType: string, elementId: number, parentFolderId: number ): void {
		this.router.navigate( [ 'bookmarks', 'view', parentFolderId, elementType, elementId ] ); // Absolute
	}

}
