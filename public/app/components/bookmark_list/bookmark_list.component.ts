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
import { BookmarkDetailsComponent } from './../bookmark_details/bookmark_details.component';
import { IconComponent } from './../../shared/icon/icon.component';

/**
 * Bookmark list component
 */
@Component( {
	directives: [
		BookmarkDetailsComponent,
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
	 * All bookmarks
	 */
	private allBookmarks: IBookmark[];

	/**
	 * Bookmarks
	 */
	private bookmarks: IBookmark[];

	/**
	 * All folders
	 */
	private allFolders: IFolder[];

	/**
	 * Folders
	 */
	private folders: IFolder[];

	/**
	 * Labels
	 */
	private labels: ILabel[];

	/**
	 * Currently selected element
	 */
	private selectedElement: IBookmark | IFolder;

	/**
	 * Type of the currently selected element
	 */
	private selectedElementType: string;

	/**
	 * Status flag for panel
	 */
	private detailsAreVisible: boolean;

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
		this.selectedElement = null;
		this.selectedElementType = null;
		this.detailsAreVisible = false;

	}

	/**
	 * Call this when the view gets initialized
	 */
	public ngOnInit(): void {

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

				// Wait until we have all data
				if ( !this.folderService.isFetching && !this.bookmarkService.isFetching ) {

					// Set all values
					this.allFolders = data[ 0 ];
					this.allBookmarks = data[ 1 ];

					// Get current route details
					this.currentPath = ( this.routeParams.get( '*' ) || '' ).toLowerCase();

					// Setup temp values
					let elementId: number;
					let elementType: string;
					let currentFolder: IFolder;

					// Special treatment for the bookmarks root folder
					if ( this.currentPath.length === 0 ) {

						// Set current folder
						currentFolder = this.folderService.getFolderByPath( data[ 0 ], '' );

						// Case: Bookmark details
						if ( this.routeParams.get( 'bookmark' ) !== null ) {
							elementType = 'bookmark';
							elementId = parseInt( this.routeParams.get( 'bookmark' ), 10 );
						// Case: Folder details
						} else if ( this.routeParams.get( 'folder' ) !== null ) {
							elementType = 'folder';
							elementId = parseInt( this.routeParams.get( 'folder' ), 10 );
						// Case: Search
						} else if ( this.routeParams.get( 'value' ) !== null ) {

							// Set all folders and bookmarks
							this.folders = data[ 0 ];
							this.bookmarks = data[ 1 ];

							// Set search option
							this.searchOptions.isSearching = true;
							this.searchOptions.value = this.routeParams.get( 'value' ); // TODO: Rename + labels

							// That's a wrap ...
							return;

						}

					// All other folders (subfolders)
					} else {

						// First try: Get the current folder
						// We don't know yet whether the last part of the path is a bookmark / folder id or a folder name,
						// so first we think it's the name of a folder
						currentFolder = this.folderService.getFolderByPath( data[ 0 ], this.currentPath );

						// Error handling for the first try
						if ( typeof currentFolder === 'undefined' ) {

							// Just remove the last element which follows after a semicolon and save this element (after
							// splitting) as the element id and path, then build up the new path
							let tempCurrentPath: string[] = this.currentPath.split( '/;' );
							let tempRouteParams: string[] = tempCurrentPath.pop().split( '=' );
							elementType = tempRouteParams[ 0 ];
							elementId = parseInt( tempRouteParams[ 1 ], 10 );
							this.currentPath = tempCurrentPath.join( '/;' );

							// Second try: Get the current folder
							// So ... first try didn't work, so it might be possible that there is a parameter telling us
							// which bookmark / folder we want toshow the details for
							currentFolder = this.folderService.getFolderByPath( data[ 0 ], this.currentPath );

							// Error handling for the second try
							if ( typeof currentFolder === 'undefined' ) {

								// Now we can be sure that the path does not exist, so we navigate back to the root
								this.router.navigateByUrl( 'bookmarks' );

								// Shut it down ... just ... shut it down ...
								return;

							}

						}

					}

					// Get folders and bookmarks for this path
					this.folders = this.folderService.getFoldersByFolderId( data[0], currentFolder.id );
					this.bookmarks = this.bookmarkService.getBookmarksByFolderId( data[1], currentFolder.id );

					// Eventually show the details panel
					if ( typeof elementId !== 'undefined' && typeof elementType !== 'undefined' ) {

						// Check whether we want to show details of a bookmark or a folder
						switch (elementType) {

							// Bookmark
							case 'bookmark':
								for (const bookmark of this.bookmarks) {
									if (bookmark.id === elementId) {
										this.selectedElement = bookmark;
										break;
									}
								}
								break;

							// Folder
							case 'folder':
								for (const folder of this.folders) {
									if (folder.id === elementId) {
										this.selectedElement = folder;
										break;
									}
								}
								break;

							default:
							// TODO - nothing here?

						}

						// Set values
						this.selectedElementType = elementType;
						setTimeout( () => {
							console.log('THIS IS HAPPENINNNNNNN');
							this.detailsAreVisible = true;
						} );

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
	private goToFolder( folderId: number ): void {

		// Build url
		let url: string = this.folderService.getPathByFolderId( this.allFolders, folderId );
		if ( url.length === 0 ) {
			url = 'bookmarks';
		} else {
			url = `bookmarks/${ url }`;
		}

		console.log(url);

		// Navigate
		this.router.navigateByUrl( url );

	}

	/**
	 * Open the details panel
	 * @param {number} elementId   Id of the element
	 * @param {string} elementType Type of the element (bookmark / folder)
	 */
	private openDetails( elementId: number, elementType: string ): void {

		// Build url
		let url: string;
		if ( this.currentPath.length === 0 ) {
			url = `bookmarks/;${ elementType }=${ elementId }`;
		} else {
			url = `bookmarks/${ this.currentPath }/;${ elementType }=${ elementId }`;
		}

		// Navigate
		this.router.navigateByUrl( url );

	}

	/**
	 * Close the details panel
	 */
	private closeDetails(): void {

		// Build url
		let url: string;
		if ( this.currentPath.length === 0 ) {
			url = 'bookmarks';
		} else {
			url = `bookmarks/${ this.currentPath }`;
		}

		// Navigate - TODO: Need a better solution here
		this.detailsAreVisible = false;
		setTimeout(
			() => {
				this.router.navigateByUrl( url );
			},
			250
		);

	}

}
