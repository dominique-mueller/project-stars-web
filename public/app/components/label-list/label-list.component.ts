/**
 * External imports
 */
import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Map } from 'immutable';

/**
 * Internal imports
 */
import { Label, LabelDataService } from './../../services/label';
import { IconComponent } from './../../shared/icon/icon.component';

/**
 * Label list component (smart)
 */
@Component( {
	changeDetection: ChangeDetectionStrategy.OnPush,
	directives: [
		IconComponent
	],
	host: {
		class: 'label-list'
	},
	selector: 'app-label-list',
	templateUrl: 'label-list.component.html'
} )
export class LabelListComponent implements OnInit, OnDestroy {

	/**
	 * Change detector
	 */
	private changeDetector: ChangeDetectorRef;

	/**
	 * Label data service
	 */
	private labelDataService: LabelDataService;

	/**
	 * Service subscriptions
	 */
	private serviceSubscriptions: Array<Subscription>;

	/**
	 * List of all labels
	 */
	private labels: Map<number, Label>;

	/**
	 * ID of the label that is currently edited
	 */
	private editedLabelId: number;

	/**
	 * Constructor
	 */
	constructor( changeDetector: ChangeDetectorRef, labelDataService: LabelDataService ) {

		// Initialize services
		this.changeDetector = changeDetector;
		this.labelDataService = labelDataService;

		// Setup
		this.serviceSubscriptions = [];
		this.labels = Map<number, Label>();
		this.editedLabelId = null; // None edited by default

	}

	/**
	 * Call this when the view gets initialized
	 */
	public ngOnInit(): void {

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
	 * Enable edit mode for a label
	 * @param {number} labelId Label ID
	 */
	private edit( labelId: number ): void {
		this.editedLabelId = labelId;
	}

	/**
	 * Disable edit mode (for a label)
	 */
	private cancel(): void {
		this.editedLabelId = null;
	}

	/**
	 * Delete a label
	 * @param {number} labelId Label ID
	 */
	private delete( labelId: number ): void {
		this.labelDataService.deleteLabel( labelId );
	}

	/**
	 * Update a label
	 * @param {number} labelId Label ID
	 * @param {string} name    Potentially changed name
	 */
	private update( labelId: number, name: string ): void {

		// Only update if values have actually changed
		let data: any = {};
		if ( this.labels.get( labelId ).get( 'name' ) !== name ) {
			data[ 'name' ] = name;
			this.labelDataService.updateLabel( labelId, data );
		}

		this.editedLabelId = null;

	}

}
