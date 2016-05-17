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
import { Bookmark, BookmarkDataService, BookmarkLogicService } from './../../services/bookmark';
import { Folder, FolderDataService, FolderLogicService } from './../../services/folder';
import { Label, LabelDataService, LabelLogicService } from './../../services/label';
import { DialogConfirmService } from './../../shared/dialog-confirm/dialog-confirm.service';
import { LabelSimpleComponent } from './../../shared/label-simple/label-simple.component';
import { IconComponent } from './../../shared/icon/icon.component';
import { EditableInputComponent } from './../../shared/editable-input/editable-input.component';
import { AssignLabelComponent } from './../../shared/assign-label/assign-label.component';
import { MoveIntoFolderComponent } from './../../shared/move-into-folder/move-into-folder.component';

/**
 * View component (smart): Bookmark details
 * Sidenote: Very similar to the FolderDetailsComponent
 */
@Component( {
	changeDetection: ChangeDetectionStrategy.OnPush,
	directives: [
		LabelSimpleComponent,
		IconComponent,
		EditableInputComponent,
		AssignLabelComponent,
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
	 * List containing all service subscriptions
	 */
	private serviceSubscriptions: Array<Subscription>;

	/**
	 * Current bookmark ID
	 */
	private bookmarkId: number;

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
	private allLabels: Map<number, Label>;

	/**
	 * Map of all currently unassigned labels
	 */
	private unassignedLabels: Map<number, Label>;

	/**
	 * Visibility status flag (for animation purposes)
	 */
	private isVisible: boolean;

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
		labelLogicService: LabelLogicService,
		dialogConfirmService: DialogConfirmService) {

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

		// Setup
		this.serviceSubscriptions = [];
		this.bookmarkId = null;
		this.bookmark = null;
		this.folders = List<Folder>();
		this.allLabels = Map<number, Label>();
		this.unassignedLabels = Map<number, Label>();
		this.isVisible = false;

	}

	/**
	 * Call this when the router gets activated
	 * This function only handles stuff that has to do with routing
	 */
	public routerOnActivate( curr: RouteSegment, prev?: RouteSegment, currTree?: RouteTree, prevTree?: RouteTree ): void {

		// Get bookmark ID from the route URL
		// Pre-filter: If the ID is not a number, we navigate back
		if ( curr.parameters.hasOwnProperty( 'id' ) && /^\d+$/.test( curr.parameters[ 'id' ] ) ) {
			this.bookmarkId = parseInt( curr.parameters[ 'id' ], 10 );
		} else {
			this.onClose();
		}

	}

	/**
	 * Call this when the view gets initialized
	 * We do NOT land here if we have been thrown out in the 'routerOnActive' function above
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
			( labels: Map<number, Label> ) => {
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
		const folderId: number = ( this.bookmark !== null && this.bookmark.size > 0 ) ? this.bookmark.get( 'path' ) : 0;
		this.isVisible = false;
		setTimeout(
			() => {
				this.router.navigate( [ 'bookmarks', 'view', folderId ] ); // Absolute
			},
			275 // Needs 250, plus some (maybe unnecessary) extra time
		);

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
					this.bookmarkDataService.deleteBookmark( this.bookmarkId );
				}
			} );

	}

	/**
	 * Update bookmark attribute
	 * @param {string} attribute Attribute / key
	 * @param {string} newValue  New / updated value
	 */
	private onUpdate( attribute: string, newValue: string ): void {
		this.bookmarkDataService.updateBookmarkValue( this.bookmarkId, attribute, newValue );
	}

	/**
	 * Assign a new label to the current bookmark
	 * @param {number} labelId Label ID
	 */
	private assignLabel( labelId: number ): void {
		this.bookmarkDataService.assignLabelToBookmark( this.bookmarkId, this.bookmark.get( 'labels' ), labelId );
	}

	/**
	 * Unassign a label from the current bookmark
	 * @param {number} labelId Label ID
	 */
	private unassignLabel( labelId: number ): void {
		this.bookmarkDataService.unassignLabelFromBookmark( this.bookmarkId, this.bookmark.get( 'labels' ), labelId );
	}

	/**
	 * Move bookmark into another folder
	 * @param {number} parentFolderId New parent folder ID
	 */
	private onMoveBookmark( parentFolderId: number ): void {
		this.onClose();
		this.bookmarkDataService.updateBookmarkValue( this.bookmarkId, 'path', parentFolderId );
	}

}
