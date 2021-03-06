/**
 * File: Bookmark details component
 */

import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Router, RouteSegment, RouteTree, OnActivate } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { List, Map } from 'immutable';

import { Bookmark, BookmarkDataService, BookmarkLogicService } from './../../services/bookmark';
import { Folder, FolderDataService, FolderLogicService } from './../../services/folder';
import { Label, LabelDataService, LabelLogicService } from './../../services/label';
import { UiService } from './../../services/ui';
import { DialogConfirmService, AssignLabelComponent, EditableInputComponent, IconComponent, LabelSimpleComponent,
	MoveIntoFolderComponent, NotifierService } from './../../shared';

/**
 * View component (smart): Bookmark details
 * Sidenote: Very similar to the FolderDetailsComponent
 */
@Component( {
	changeDetection: ChangeDetectionStrategy.OnPush,
	directives: [
		AssignLabelComponent,
		EditableInputComponent,
		IconComponent,
		LabelSimpleComponent,
		MoveIntoFolderComponent
	],
	providers: [
		LabelLogicService
	],
	templateUrl: './bookmark-details.component.html'
} )
export class BookmarkDetailsComponent implements OnActivate, OnInit, OnDestroy {

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
	 * Folder logics service
	 */
	private folderLogicService: FolderLogicService;

	/**
	 * Label data service
	 */
	private labelDataService: LabelDataService;

	/**
	 * Label logic service
	 */
	private labelLogicService: LabelLogicService;

	/**
	 * Dialog confirm service
	 */
	private dialogConfirmService: DialogConfirmService;

	/**
	 * Notifier service
	 */
	private notifierService: NotifierService;

	/**
	 * List containing all service subscriptions
	 */
	private serviceSubscriptions: Array<Subscription>;

	/**
	 * Current bookmark ID
	 */
	private bookmarkId: string;

	/**
	 * Current bookmark
	 */
	private bookmark: Bookmark;

	/**
	 * List of folders
	 */
	private folders: List<Folder>;

	/**
	 * Map of all labels
	 */
	private allLabels: Map<string, Label>;

	/**
	 * Map of all currently unassigned labels
	 */
	private unassignedLabels: Map<string, Label>;

	/**
	 * Visibility status flag (for animation purposes)
	 */
	private isVisible: boolean;

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
	 * @param {LabelLogicService}    labelLogicService    Label logic service
	 * @param {DialogConfirmService} dialogConfirmService Dialog confirm service
	 * @param {NotifierService}      notifierService      Notifier service
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
		labelLogicService: LabelLogicService,
		dialogConfirmService: DialogConfirmService,
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
		this.labelLogicService = labelLogicService;
		this.dialogConfirmService = dialogConfirmService;
		this.notifierService = notifierService;

		// Setup
		this.serviceSubscriptions = [];
		this.bookmarkId = null;
		this.bookmark = null;
		this.folders = List<Folder>();
		this.allLabels = Map<string, Label>();
		this.unassignedLabels = Map<string, Label>();
		this.isVisible = false;

	}

	/**
	 * Call this when the router gets activated
	 * This function only handles stuff that has to do with routing
	 */
	public routerOnActivate( curr: RouteSegment, prev?: RouteSegment, currTree?: RouteTree, prevTree?: RouteTree ): void {

		// Get bookmark ID from the route URL
		this.bookmarkId = curr.parameters[ 'id' ];

	}

	/**
	 * Call this when the view gets initialized
	 */
	public ngOnInit(): void {

		// Get bookmarks from its service, then find the right one
		const bookmarkDataServiceSubscription: Subscription = this.bookmarkDataService.bookmarks.subscribe(
			( bookmarks: List<Bookmark> ) => {
				if ( bookmarks.size > 0 ) {

					// Try to find the correct bookmark
					this.bookmark = this.bookmarkLogicService.getBookmarkByBookmarkId( bookmarks, this.bookmarkId );

					// Navigate back if the bookmark doesn't exist
					if ( this.bookmark === null ) {
						this.onClose();
					} else {

						// Convert date strings into date objects (for view only, makes the date pipe work properly)
						this.bookmark = <Bookmark> this.bookmark.set( 'created', new Date( this.bookmark.get( 'created' ) ) );
						if ( this.bookmark.get( 'updated' ) !== null ) {
							this.bookmark = <Bookmark> this.bookmark.set( 'updated', new Date( this.bookmark.get( 'updated' ) ) );
						}

						// Update UI state
						// This should notify other components, like the bookmark list one
						this.uiService.setSelectedElement( 'bookmark', this.bookmarkId );

						// Calculate unassigned labels
						if ( this.allLabels.size > 0 ) {
							this.unassignedLabels = this.labelLogicService.getUnassignedLabelsByBookmark( this.allLabels, this.bookmark );
						}
						this.changeDetector.markForCheck(); // Trigger change detection

					}
				}

			}
		);

		// Get folders from its service
		const folderDataServiceSubscription: Subscription = this.folderDataService.folders.subscribe(
			( folders: List<Folder> ) => {
				if ( folders.size > 0 ) {
					this.folders = folders;
					this.changeDetector.markForCheck(); // Trigger change detection
				}

			}
		);

		// Get labels from its service
		const labelDataServiceSubscription: Subscription = this.labelDataService.labels.subscribe(
			( labels: Map<string, Label> ) => {
				if ( labels.size > 0 ) {

					this.allLabels = labels;

					// Calculate unassigned labels
					if ( this.bookmark !== null ) {
						this.unassignedLabels = this.labelLogicService.getUnassignedLabelsByBookmark( this.allLabels, this.bookmark );
					}
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

		// Animate in
		setTimeout(
			() => {
				this.isVisible = true;
				this.changeDetector.markForCheck(); // Trigger change detection
			},
			25 // Some extra time before animation starts
		);

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
	 * Close this details panel
	 */
	private onClose(): void {

		// Remove especially the bookmark data service subscription
		// Otherwise the current bookmark will be deleted and later on (after the timeout) we cannot get the path
		this.ngOnDestroy();

		// Update UI state
		// This should notify other components, like the bookmark list one
		this.uiService.unsetSelectedElement();

		// Animate out, navigate when animation is done
		if ( this.bookmark !== null && this.bookmark.size > 0 ) {
			this.isVisible = false;
			setTimeout(
				() => {
					this.router.navigate( [ 'bookmarks', 'view', this.bookmark.get( 'path' ) ] ); // Absolute
				},
				275 // Needs 250, plus some (maybe unnecessary) extra time
			);
		} else {
			this.isVisible = false;
			this.uiService.unsetOpenedFolderId();
			this.router.navigate( [ 'bookmarks' ] ); // Absolute
		}

	}

	/**
	 * Delete this bookmark, close the panel
	 */
	private onDelete(): void {

		// Setup confirmation dialog
		let confirmationOptions: any = {
			message: `Please confirm that you want to delete the "${ this.bookmark.get( 'title' ) }" bookmark.`,
			noText: 'Cancel',
			title: 'Deleting a bookmark',
			type: 'danger',
			yesText: 'Delete bookmark'
		};

		// Ask for confirmation first
		this.dialogConfirmService.requestConfirmation( confirmationOptions )
			.then( ( answer: boolean ) => {
				if ( answer ) {
					this.onClose();

					// Try to delete the bookmark
					this.bookmarkDataService.deleteBookmark( this.bookmarkId )
						.then( ( data: any ) => {
							this.notifierService.notify( 'default', 'Bookmark successfully deleted.' );
						} )
						.catch( ( error: any ) => {
							this.notifierService.notify( 'default', 'An error occured while deleting the bookmark.' );
						} );

				}
			} );

	}

	/**
	 * Update bookmark attribute
	 * @param {string} attribute Attribute / key
	 * @param {string} newValue  New / updated value
	 */
	private onUpdate( attribute: string, newValue: string ): void {

		// Create updated data
		let updatedBookmark: any = {};
		updatedBookmark[ attribute ] = newValue;

		// Try to update the bookmark
		this.bookmarkDataService.updateBookmark( this.bookmarkId, updatedBookmark )
			.then( ( data: any ) => {
				this.notifierService.notify( 'default', 'Bookmark successfully updated.' );
			} )
			.catch( ( error: any ) => {
				this.notifierService.notify( 'default', 'An error occured while updating the bookmark.' );
			} );

	}

	/**
	 * Assign a new label to the current bookmark
	 * @param {string} labelId Label ID
	 */
	private assignLabel( labelId: string ): void {

		// Try to update the bookmark
		this.bookmarkDataService.assignLabelToBookmark( this.bookmarkId, this.bookmark.get( 'labels' ), labelId )
			.then( ( data: any ) => {
				this.notifierService.notify( 'default', 'Label successfully added to the bookmark.' );
			} )
			.catch( ( error: any ) => {
				this.notifierService.notify( 'default', 'An error occured while adding the label to the bookmark.' );
			} );
	}

	/**
	 * Unassign a label from the current bookmark
	 * @param {string} labelId Label ID
	 */
	private unassignLabel( labelId: string ): void {

		// Try to update the bookmark
		this.bookmarkDataService.unassignLabelFromBookmark( this.bookmarkId, this.bookmark.get( 'labels' ), labelId )
			.then( ( data: any ) => {
				this.notifierService.notify( 'default', 'Label successfully removed from the bookmark.' );
			} )
			.catch( ( error: any ) => {
				this.notifierService.notify( 'default', 'An error occured while removing the label from the bookmark.' );
			} );

	}

	/**
	 * Move bookmark into another folder
	 * @param {string} parentFolderId New parent folder ID
	 */
	private onMoveBookmark( parentFolderId: string ): void {
		this.onClose();

		// Create updated data
		let updatedBookmark: any = {
			path: parentFolderId
		};

		// Try to udpate the bookmark
		this.bookmarkDataService.updateBookmark( this.bookmarkId, updatedBookmark )
			.then( ( data: any ) => {
				this.notifierService.notify( 'default', 'Bookmark successfully moved into another folder.' );
			} )
			.catch( ( error: any ) => {
				this.notifierService.notify( 'default', 'An error occured while moving the bookmark into another folder.' );
			} );

	}

}
