/**
 * External imports
 */
import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ROUTER_DIRECTIVES, Router, RouteSegment, RouteTree, OnActivate } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { List, Map } from 'immutable';

/**
 * Internal imports
 */
import { UiService } from './../../services/ui';
import { Bookmark, BookmarkDataService, BookmarkLogicService } from './../../services/bookmark';
import { Label, LabelDataService, LabelLogicService } from './../../services/label';
import { LabelComponent } from './../../shared/label/label.component';
import { IconComponent } from './../../shared/icon/icon.component';
import { EditableInputComponent } from './../../shared/editable_input/editable_input.component';
import { AssignLabelComponent } from './../../shared/assign_label/assign_label.component';

/**
 * Bookmark details component (smart)
 */
@Component( {
	changeDetection: ChangeDetectionStrategy.OnPush,
	directives: [
		LabelComponent,
		IconComponent,
		EditableInputComponent,
		AssignLabelComponent
	],
	providers: [
		LabelLogicService
	],
	selector: 'app-bookmark-details',
	templateUrl: './bookmark-details.component.html'
} )
export class BookmarkDetailsComponent implements OnActivate, OnInit, OnDestroy {

	/**
	 * Router
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
	 * Label data service
	 */
	private labelDataService: LabelDataService;

	/**
	 * Label logic service
	 */
	private labelLogicService: LabelLogicService;

	/**
	 * Service subscriptions
	 */
	private serviceSubscriptions: Array<Subscription>;

	/**
	 * Bookmark ID
	 */
	private bookmarkId: number;

	/**
	 * Bookmark
	 */
	private bookmark: Bookmark;

	/**
	 * Map of all labels
	 */
	private allLabels: any;

	/**
	 * Map of currently unassigned labels
	 */
	private unassignedLabels: any;

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

		// Initialize services
		this.router = router;
		this.changeDetector = changeDetector;
		this.uiService = uiService;
		this.bookmarkDataService = bookmarkDataService;
		this.bookmarkLogicService = bookmarkLogicService;
		this.labelDataService = labelDataService;
		this.labelLogicService = labelLogicService;

		// Setup
		this.bookmarkId = null;
		this.bookmark = null;
		this.allLabels = Map<string, Map<string, any>>();
		this.unassignedLabels = Map<string, Map<string, any>>();
		this.serviceSubscriptions = [];
		this.isVisible = false;

	}

	/**
	 * Call this when the router gets activated
	 * This function only handles stuff that has to do with routing
	 */
	public routerOnActivate(
		curr: RouteSegment,
		prev?: RouteSegment,
		currTree?: RouteTree,
		prevTree?: RouteTree ): void {

		console.log('BOOKMARK DETAILS: ROUTER ACTIVATE'); // TODO: Remove me

		// Save current URL segment, needed for relative navigation later on
		this.currentUrlSegment = curr;

		// Get element ID from the route URL
		// Pre-filter: If the ID is not a number, we navigate back
		if ( curr.parameters.hasOwnProperty( 'id' ) && /^\d+$/.test( curr.parameters[ 'id' ] ) ) {
			this.bookmarkId = parseInt( curr.parameters[ 'id' ], 10 );
		} else {
			this.closeDetails();
		}

		console.log('> Bookmark ID: ' + this.bookmarkId); // TODO: Remove me

	}

	/**
	 * Call this when the view gets initialized
	 * We do NOT land here if we have been thrown out in the 'routerOnActive' function above
	 */
	public ngOnInit(): void {

		console.log('BOOKMARK LIST: ON INIT'); // TODO: Remove me

		// Get bookmarks from its service, then find the right one
		const bookmarkServiceSubscription: Subscription = this.bookmarkDataService.bookmarks.subscribe(
			( bookmarks: List<Bookmark> ) => {
				if ( bookmarks.size > 0 ) {

					// Try to find the correct bookmark
					this.bookmark = this.bookmarkLogicService.getBookmarkByBookmarkId( bookmarks, this.bookmarkId );

					// Navigate back if the bookmark doesn't exist
					if ( this.bookmark === null ) {
						this.closeDetails();
					} else {

						// Update UI state
						// This should notify other components, like the bookmark list one
						this.uiService.setSelectedElement( 'bookmark', this.bookmarkId );

						if ( this.allLabels.size > 0 ) {
							this.unassignedLabels = this.labelLogicService.getUnassignedLabelsByBookmark(this.allLabels, this.bookmark);
						}
						this.changeDetector.markForCheck(); // Trigger change detection

					}

				}
			}
		);

		// Get labels from its service
		const labelServiceSubscription: Subscription = this.labelDataService.labels.subscribe(
			( labels: any ) => {
				if ( labels.size > 0 ) {
					this.allLabels = labels;
					if ( this.bookmark !== null ) {
						this.unassignedLabels = this.labelLogicService.getUnassignedLabelsByBookmark(this.allLabels, this.bookmark);
					}
					this.changeDetector.markForCheck(); // Trigger change detection
				}
			}
		);

		// Save subscriptions
		this.serviceSubscriptions = [
			bookmarkServiceSubscription,
			labelServiceSubscription
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

		console.log('BOOKMARK DETAILS: ON DESTROY'); // TODO: Remove me

		// Unsubscribe from all services (free resources manually)
		this.serviceSubscriptions.forEach( ( subscription: Subscription ) => {
			subscription.unsubscribe();
		} );

	}

	// TODO: Refactor name?
	private closeDetails(): void {

		// Update UI state
		// This should notify other components, like the bookmark list one
		this.uiService.unsetSelectedElement();

		// Animate out
		this.isVisible = false;

		// Navigate when animation is done
		setTimeout(
			() => {
				this.router.navigate( [ '../..' ], this.currentUrlSegment ); // TODO: Mysteriously sometimes work, sometimes not
			},
			275 // Needs 250, plus some (maybe unnecessary) extra time
		);

	}

	/**
	 * Update bookmark attribute
	 * @param {string} attribute Attribute / key
	 * @param {string} newValue  New / updated value
	 */
	private updateBookmark( attribute: string, newValue: string ): void {
		this.bookmarkDataService.updateBookmarkValue( this.bookmarkId, attribute, newValue );
	}

	/**
	 * Assign a new label to the current bookmark
	 * @param {number} labelId Label ID
	 */
	private assignLabelToBookmark( labelId: number ): void {
		this.bookmarkDataService.assignLabelToBookmark( this.bookmarkId, this.bookmark.get( 'labels' ), labelId );
	}

	/**
	 * Unassign a label from the current bookmark
	 * @param {number} labelId Label ID
	 */
	private unassignLabelFromBookmark( labelId: number ): void {
		this.bookmarkDataService.unassignLabelFromBookmark( this.bookmarkId, this.bookmark.get( 'labels' ), labelId );
	}

}
