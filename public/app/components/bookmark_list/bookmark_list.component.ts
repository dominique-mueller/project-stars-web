/**
 * External imports
 */
import { Component, OnInit, OnDestroy } from 'angular2/core';
import { Router, RouteParams } from 'angular2/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/observable/combineLatest';

/**
 * Internal imports
 */
import { BookmarkService, IBookmark } from './../../services/bookmark/bookmark.service';
import { FolderService, IFolder } from './../../services/folder/folder.service';
import { LabelService, ILabel } from './../../services/label/label.service';
import { SearchPipe } from './search.pipe';
import { UrlPipe } from './url.pipe';
import { IconComponent } from './../../shared/icon/icon.component';

/**
 * Bookmark list component
 */
@Component( {
	directives: [
		IconComponent
	],
	pipes: [
		SearchPipe,
		UrlPipe
	],
	selector: 'app-bookmark-list',
	templateUrl: './bookmark_list.component.html'
} )
export class BookmarkListComponent implements OnInit, OnDestroy {

	/**
	 * Router service
	 */
	private router: Router;

	/**
	 * Route params service
	 */
	private routeParams: RouteParams;

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
	 * Service subscription reference
	 */
	private serviceSubscription: Subscription;

	/**
	 * Bookmarks
	 */
	private bookmarks: IBookmark[];

	/**
	 * Folders
	 */
	private folders: IFolder[];

	/**
	 * Labels
	 */
	private labels: ILabel[];

	/**
	 * Current folder path
	 */
	private currentPath: string;

	/**
	 * Search options
	 */
	private searchOptions: {
		isSearching: boolean, // Search status toggle
		value: string // Search input value
	};

	/**
	 * Constructor
	 * @param {Router}          router          Router service
	 * @param {RouteParams}     routeParams     Route params service
	 * @param {BookmarkService} bookmarkService Bookmark service
	 * @param {FolderService}   folderService   Folder service
	 */
	constructor(
		router: Router, routeParams: RouteParams,
		bookmarkService: BookmarkService, folderService: FolderService, labelService: LabelService
	) {

		// Initialize services
		this.router = router;
		this.routeParams = routeParams;
		this.bookmarkService = bookmarkService;
		this.folderService = folderService;
		this.labelService = labelService;

		// Setup
		this.searchOptions = {
			isSearching: false,
			value: ''
		};

	}

	/**
	 * Call this when the view gets initialized
	 */
	public ngOnInit(): void {

		// Get current route details
		this.currentPath = ( this.routeParams.get( '*' ) || '' ).toLowerCase();

		// Get labels from its service - TODO: Unsubscribe
		this.labelService.labels
			.subscribe(
				( data: ILabel[] ) => {

					// Set labels as object (for easier access)
					this.labels = this.labelService.convertLabelListToObject( data );

				},
				( error: any ) => {
					console.log('!! COMPONENT ERROR'); // TODO: Better error handling
					console.log(error);
				}
			);

		// Get folders and bookmarks from their services - TODO: Maybe split?
		this.serviceSubscription = Observable.combineLatest(
			this.folderService.folders,
			this.bookmarkService.bookmarks
		).subscribe(
			( data: [ IFolder[], IBookmark[] ] ) => {

				// First, check if we're currently searching
				if ( this.currentPath.length === 0 && Object.keys( this.routeParams.params ).length > 0 ) {

					// Set all folders and bookmarks
					this.folders = data[ 0 ];
					this.bookmarks = data[ 1 ];

					// Set search option
					this.searchOptions.isSearching = true;
					this.searchOptions.value = this.routeParams.get( 'value' ) || '';

				} else {

					// Wait until we have all date (no fetching is going on any longer)
					if ( !this.folderService.isFetching && !this.bookmarkService.isFetching ) {

						// Get the current folder
						let currentFolder: IFolder = this.folderService.getFolderByPath( data[ 0 ], this.currentPath );

						// Error Handling:
						// Check if we were able to find the path, if not the path doesn't exist
						if ( typeof currentFolder === 'undefined' ) {
							this.router.navigateByUrl( 'bookmarks' ); // TODO: Show some notification?
						} else {

							// Get folders and bookmarks for this path
							this.folders = this.folderService.getFoldersByFolderId( data[ 0 ], currentFolder.id );
							this.bookmarks = this.bookmarkService.getBookmarksByFolderId( data[ 1 ], currentFolder.id );

						}

					}

				}

			},
			( error: any ) => {
				console.log('!! COMPONENT ERROR'); // TODO: Better error handling
				console.log(error);
			}
		);

	}

	/**
	 * Call this when the view gets destroyed
	 */
	public ngOnDestroy(): void {

		// Unsubscribe from all services (free resources)
		this.serviceSubscription.unsubscribe();

	}

	/**
	 * Navigate to another route
	 * @param {string} folderName Name of the subfolder
	 */
	private goToFolder( folderName: string ): void {

		// Create new route url, again special treatment for the root bookmarks folder here
		let routeUrl: string;
		if ( this.currentPath === '' ) {
			routeUrl = `bookmarks/${ folderName.toLowerCase() }`;
		} else {
			routeUrl = `bookmarks/${ this.currentPath }/${ folderName.toLowerCase() }`;
		}

		// Navigate to the created url
		this.router.navigateByUrl( routeUrl );

	}

}
