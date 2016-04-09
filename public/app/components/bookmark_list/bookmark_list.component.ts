/**
 * External imports
 */
import { Component, OnInit, OnDestroy } from 'angular2/core';
import { Router, RouteParams } from 'angular2/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/observable/combineLatest';
import { List, Map } from 'immutable';

/**
 * Internal imports
 */
import { UiService } from './../../services/ui/ui.service';
import { BookmarkService, IBookmark } from './../../services/bookmark/bookmark.service';
import { FolderService, IFolder } from './../../services/folder/folder.service';
import { LabelService, ILabel } from './../../services/label/label.service';
import { BookmarkDetailsComponent } from './../bookmark_details/bookmark_details.component';
import { BookmarkComponent } from './../../shared/bookmark/bookmark.component';
import { FolderComponent } from './../../shared/folder/folder.component';
import { IconComponent } from './../../shared/icon/icon.component';

/**
 * Bookmark list component
 */
@Component( {
	directives: [
		BookmarkComponent,
		FolderComponent,
		BookmarkDetailsComponent,
		IconComponent
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
	 * Ui service
	 */
	private uiService: UiService;

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
	 * Service subscriptions
	 */
	private serviceSubscriptions: Array<Subscription>;

	/**
	 * Bookmarks
	 */
	private bookmarks: List<Map<string, any>>;

	/**
	 * Folders
	 */
	private folders: List<Map<string, any>>;

	/**
	 * All folders
	 */
	private allFolders: List<Map<string, any>>;

	/**
	 * Labels
	 */
	private labels: Map<string, Map<string, any>>;

	/**
	 * Information about the currently selected element
	 */
	private selectedElement: Map<string, any>;

	/**
	 * Data of the currently selected element
	 */
	private selectedElementData: Map<string, any>;

	/**
	 * Status flag for panel
	 */
	private isDetailsPanelVisible: boolean;

	/**
	 * Currently opened folder
	 */
	private openedFolder: number;

	/**
	 * Current folder path
	 */
	private openedFolderPath: string;

	/**
	 * Constructor
	 * @param {Router}          router          Router service
	 * @param {RouteParams}     routeParams     Route params service
	 * @param {BookmarkService} bookmarkService Bookmark service
	 * @param {FolderService}   folderService   Folder service
	 */
	constructor(
		router: Router, routeParams: RouteParams, uiService: UiService,
		bookmarkService: BookmarkService, folderService: FolderService, labelService: LabelService
	) {

		// Initialize services
		this.router = router;
		this.routeParams = routeParams;
		this.uiService = uiService;
		this.bookmarkService = bookmarkService;
		this.folderService = folderService;
		this.labelService = labelService;

		// Setup
		this.isDetailsPanelVisible = false;

	}

	/**
	 * Call this when the view gets initialized
	 */
	public ngOnInit(): void {

		// Get UI state
		const uiServiceSubscription: Subscription = this.uiService.uiState.subscribe(
			( uiState: Map<string, any> ) => {

				// Update ui states (when necessary)
				if ( this.openedFolder !== uiState.get( 'openedFolder' ) ) {
					this.openedFolder = uiState.get( 'openedFolder' );
				}
				if ( this.selectedElement !== uiState.get( 'selectedElement' ) ) {
					this.selectedElement = uiState.get( 'selectedElement' );
				}

			}
		);

		// Get labels from its service
		const labelServiceSubscription: Subscription = this.labelService.labels.subscribe(
			// ( labels: Map<string, Map<string, any>> ) => this.labels = labels
			( labels: any ) => this.labels = labels
		);

		// Get folders and bookmarks from their services - TODO: Maybe split?
		const folderBookmarkServiceSubscription: Subscription = Observable.combineLatest(
			this.folderService.folders,
			this.bookmarkService.bookmarks
		).subscribe(
			( data: [ List<Map<string, any>>, List<Map<string, any>> ] ) => {

				// TODO: Extract the following into a function

				// Wait until we have data from both services
				if ( !this.folderService.isFetching && !this.bookmarkService.isFetching ) {

					// Setup all folders
					this.allFolders = data[ 0 ];

					// Get current route details (also save it for later)
					let newOpenedFolderPath: string = ( this.routeParams.get( '*' ) || '' ).toLowerCase();
					let openedFolder: number = null;
					let selectedElement: Map<string, any> = null;

					// Check if we are visiting this site the first time (e.g. by a refresh)
					// That means we can only rely on information we get out of the url in order to init this component
					if ( this.openedFolder === null || newOpenedFolderPath !== this.openedFolderPath ) {

						// Update folder path coming from url
						this.openedFolderPath = newOpenedFolderPath;

						// Special treatment for the root folder
						if ( this.openedFolderPath.length === 0 ) {

							// Set opened folder
							openedFolder = 0;

							// Get bookmark or folder parameters
							if ( this.routeParams.get( 'bookmark' ) !== null ) {
								selectedElement = Map<string, any>( {
									id: parseInt( this.routeParams.get( 'bookmark' ), 10 ),
									type: 'bookmark'
								} );
							} else if ( this.routeParams.get( 'folder' ) !== null ) {
								selectedElement = Map<string, any>( {
									id: parseInt( this.routeParams.get( 'folder' ), 10 ),
									type: 'folder'
								} );
							}

						} else {

							// Get the current folder (first try)
							// We do not know yet whether the bookmark / folder details panel should be visible or not.
							// This is being defined by the last part of the url, a parameter that begins with a semicolon.
							// The problem is that a folder can also have a semicolon in its name (freedom for the users!! :D).
							// As a consequence we first assume that the whole url is just a folder path only ...
							openedFolder = this.folderService.getFolderByPath( data[0], this.openedFolderPath );

							// Error handling for first try
							if ( openedFolder === null ) {

								// Split parameters of the path
								let splitPath: string[] = this.openedFolderPath.split( '/;' );

								// If the split path is bigger than 1, we do have a parameter
								if ( splitPath.length > 1 ) {

									let pathParams: string[] = splitPath.pop().split( '=' );
									this.openedFolderPath = splitPath.join( '/;' );

									// Build selected element if it seems to be correct (syntax only)
									if (pathParams[0] === 'bookmark' || pathParams[0] === 'folder') {
										selectedElement = Map<string, any>({
											id: parseInt(pathParams[1], 10),
											type: pathParams[0]
										});
									}

									// Get the current folder (second try)
									// So ... first try did not work. That happens. Bummer, I know. But we do not give up!
									// Let's try again, this time without the end parameter. Hopefully this time it works ...
									openedFolder = this.folderService.getFolderByPath(data[0], this.openedFolderPath);

								}

								// Error handling for second try
								if ( openedFolder === null ) {

									// Oh no ... so the path does not exist. Maybe a typo, who knows. So back to the root ...
									this.router.navigateByUrl( 'bookmarks' );

									// Shut it down ... just ... shut it down ... (if you don't know what that means: watch '30 Rock'!)
									return;

								}

							}

						}

						// Set opened folder (for the first time eveeeer ...)
						this.uiService.setOpenedFolder( openedFolder );

						// Eventually show the details panel
						if ( selectedElement !== null ) {
							this.uiService.setSelectedElement( selectedElement.get( 'type' ), selectedElement.get( 'id' ) );
						}

					} else {

						// Set local variables only
						openedFolder = this.openedFolder;
						selectedElement = this.selectedElement;

					}

					// Finally: Get folders and bookmarks for this path
					this.folders = this.folderService.getSubfolders( data[ 0 ], openedFolder );
					this.bookmarks = this.bookmarkService.getBookmarksByFolder( data[ 1 ], openedFolder );

					// Eventually show the details panel
					if ( selectedElement !== null ) {

						switch ( selectedElement.get( 'type' ) ) {

							// Show bookmark details
							case 'bookmark':

								// Find bookmark
								this.selectedElementData =
									this.bookmarkService.findBookmark( this.bookmarks, selectedElement.get( 'id' ) );

								// Erorr handling when bookmark does not exist
								if ( this.selectedElementData === null ) {
									if ( this.openedFolderPath.length === 0 ) {
										this.router.navigateByUrl( 'bookmarks' );
									} else {
										this.router.navigateByUrl( `bookmarks/${ this.openedFolderPath }` );
									}
									return;
								}

								break;

							// Show folder details
							case 'folder':

								// Find folder
								this.selectedElementData =
									this.folderService.findFolder( this.folders, selectedElement.get( 'id' ) );

								// Error handling when folder does not exist
								if ( this.selectedElementData === null ) {
									if ( this.openedFolderPath.length === 0 ) {
										this.router.navigateByUrl( 'bookmarks' );
									} else {
										this.router.navigateByUrl( `bookmarks/${ this.openedFolderPath }` );
									}
									return;
								}
								break;

							default:
								// TODO

						}

						// You remember this? You need to use this a lot in AngularJS 1.x? Flashback time? Ha - not this time!
						// The empty timeout is not exactly necessary here, but is a helpful UI performance trick:
						// By using it we animate the details panel in when the next frame is available to us
						setTimeout( () => {
							this.isDetailsPanelVisible = true;
						} );

					}

				}

			}
		);

		// Save subscriptions
		this.serviceSubscriptions = [
			uiServiceSubscription,
			labelServiceSubscription,
			folderBookmarkServiceSubscription
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
	 * @param {number} folder Name of the subfolder
	 */
	private goToFolder( folder: number ): void {

		// Update opened folder
		this.uiService.setOpenedFolder( folder );

		// Naviate to the folder
		let url: string = this.folderService.getPathByFolder( this.allFolders, folder );
		if ( url.length === 0 ) {
			this.router.navigateByUrl( 'bookmarks' );
		} else {
			this.router.navigateByUrl( `bookmarks/${ url }` );
		}

	}

	/**
	 * Open the details panel
	 * @param {number} elementId   Id of the element
	 * @param {string} elementType Type of the element (bookmark / folder)
	 */
	private openDetailsPanel( type: string, id: number ): void {

		// Set selected element
		this.uiService.setSelectedElement( type, id );

		// Navigate
		if ( this.openedFolderPath.length === 0 ) {
			this.router.navigateByUrl( `bookmarks/;${ type }=${ id }` );
		} else {
			this.router.navigateByUrl( `bookmarks/${ this.openedFolderPath }/;${ type }=${ id }` );
		}

	}

	/**
	 * Close the details panel
	 */
	private closeDetails(): void {

		// Animate the details panel out and wait for it to finish (about 250ms)
		this.isDetailsPanelVisible = false;
		setTimeout(
			() => {

				// Unset selected element
				this.uiService.unsetSelectedElement();

				// Navigate
				let url: string = this.folderService.getPathByFolder( this.allFolders, this.openedFolder );
				if ( url.length === 0 ) {
					this.router.navigateByUrl( 'bookmarks' );
				} else {
					this.router.navigateByUrl( `bookmarks/${ url }` );
				}

			},
			250
		);

	}

}
