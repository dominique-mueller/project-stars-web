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
import { Label, LabelDataService, LabelLogicService } from './../../services/label';
import { LabelSimpleComponent } from './../../shared/label-simple/label-simple.component';
import { IconComponent } from './../../shared/icon/icon.component';
import { EditableInputComponent } from './../../shared/editable-input/editable-input.component';
import { AssignLabelComponent } from './../../shared/assign-label/assign-label.component';

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
		AssignLabelComponent
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
	 * Label data service
	 */
	private labelDataService: LabelDataService;

	/**
	 * Label logic service
	 */
	private labelLogicService: LabelLogicService;

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
		labelDataService: LabelDataService,
		labelLogicService: LabelLogicService ) {

		// Initialize
		this.router = router;
		this.changeDetector = changeDetector;
		this.uiService = uiService;
		this.bookmarkDataService = bookmarkDataService;
		this.bookmarkLogicService = bookmarkLogicService;
		this.labelDataService = labelDataService;
		this.labelLogicService = labelLogicService;

		// Setup
		this.serviceSubscriptions = [];
		this.bookmarkId = null;
		this.bookmark = null;
		this.allLabels = Map<number, Label>();
		this.unassignedLabels = Map<number, Label>();
		this.isVisible = false;

	}

	/**
	 * Call this when the router gets activated
	 * This function only handles stuff that has to do with routing
	 */
	public routerOnActivate( curr: RouteSegment, prev?: RouteSegment, currTree?: RouteTree, prevTree?: RouteTree ): void {

		// Save current URL segment, needed for relative navigation later on
		this.currentUrlSegment = curr;

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

		// Get labels from its service
		const labelDataServiceSubscription: Subscription = this.labelDataService.labels.subscribe(
			( labels: any ) => {
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

		// Update UI state
		// This should notify other components, like the bookmark list one
		this.uiService.unsetSelectedElement();

		// Animate out, navigate when animation is done
		this.isVisible = false;
		setTimeout(
			() => {
				this.router.navigate( [ '../..' ], this.currentUrlSegment ); // TODO: Mysteriously sometimes work, sometimes not
			},
			275 // Needs 250, plus some (maybe unnecessary) extra time
		);

	}

	/**
	 * Delete this bookmark, close the panel
	 */
	private onDelete(): void {
		this.bookmarkDataService.deleteBookmark( this.bookmarkId );
		this.onClose();
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

}
