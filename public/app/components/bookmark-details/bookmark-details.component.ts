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
import { Bookmark, BookmarkDataService, BookmarkLogicService } from './../../services/bookmark';
import { Label, LabelDataService, LabelLogicService } from './../../services/label';
import { LabelComponent } from './../../shared/label/label.component';
import { IconComponent } from './../../shared/icon/icon.component';
import { EditableInputComponent } from './../../shared/editable_input/editable_input.component';
import { AssignLabelComponent } from './../../shared/assign_label/assign_label.component';

/**
 * Bookmark details component
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




	private bookmarkId: number;

	private bookmark: Bookmark;

	private allLabels: any;

	private unassignedLabels: any;




	/**
	 * Constructor
	 */
	constructor(
		router: Router,
		changeDetector: ChangeDetectorRef,
		bookmarkDataService: BookmarkDataService,
		bookmarkLogicService: BookmarkLogicService,
		labelDataService: LabelDataService,
		labelLogicService: LabelLogicService ) {

		// Initialize services
		this.router = router;
		this.changeDetector = changeDetector;
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

	}

	/**
	 * Call this when the router gets activated
	 * This function only handles stuff that has to do with routing
	 */
	public routerOnActivate( curr: RouteSegment, prev?: RouteSegment, currTree?: RouteTree, prevTree?: RouteTree ): void {

		console.log('BOOKMARK DETAILS: ROUTER ACTIVATE'); // TODO: Remove me

		// Save current URL segment, needed for relative navigation later on
		this.currentUrlSegment = curr;

		// Get element ID from the route URL
		// Pre-filter: If the ID is not a number, we navigate back
		if ( curr.parameters.hasOwnProperty( 'id' ) && /^\d+$/.test( curr.parameters.id ) ) {
			this.bookmarkId = parseInt( curr.parameters.id, 10 );
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
					this.bookmark = this.bookmarkLogicService.getBookmarkByBookmarkId(bookmarks, this.bookmarkId);

					// Navigate back if the bookmark doesn't exist
					if ( this.bookmark === null ) {
						this.closeDetails();
					} else {
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
		this.router.navigate( [ '../..' ], this.currentUrlSegment );
	}



	/**
	 * Update element
	 * @param {Map<string, any>} element Information about the element
	 * @param {string}           key     Key
	 * @param {string}           value   Updated value
	 */
	// private updateElement( element: Map<string, any>, key: string, value: string ): void {

	// 	// Skip of no update

	// 	// Create data
	// 	let data: any = {};
	// 	data[ key ] = value;

	// 	// Update bookmark
	// 	this.bookmarkService.updateBookmark( element.get( 'id' ), data );

	// }

	/**
	 * Assign new label to element
	 * @param {Map<string, any>} element  Information about the element
	 * @param {List<number>}     labels   List of currently assigned label ids
	 * @param {number}           newLabel New label id (to be assigned)
	 */
	// private assignLabelToElement( element: Map<string, any>, labels: List<number>, newLabel: number ): void {

	// 	// Skip if no update

	// 	// Create data
	// 	let data: any = {};
	// 	data.labels = labels.push( newLabel );

	// 	// Update bookmark
	// 	this.bookmarkService.updateBookmark( element.get( 'id' ), data );

	// }

}
