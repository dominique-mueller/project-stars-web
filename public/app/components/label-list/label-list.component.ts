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
import { LabelAdvancedComponent } from './../../shared/label-advanced/label-advanced.component';
import { IconComponent } from './../../shared/icon/icon.component';

/**
 * View component (smart): Label list
 */
@Component( {
	changeDetection: ChangeDetectionStrategy.OnPush,
	directives: [
		LabelAdvancedComponent,
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
	 * List containing all service subscriptions
	 */
	private serviceSubscriptions: Array<Subscription>;

	/**
	 * Map of labels
	 */
	private labels: Map<number, Label>;

	/**
	 * Constructor
	 */
	constructor( changeDetector: ChangeDetectorRef, labelDataService: LabelDataService ) {

		// Initialize
		this.changeDetector = changeDetector;
		this.labelDataService = labelDataService;

		// Setup
		this.serviceSubscriptions = [];
		this.labels = Map<number, Label>();

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
	 * Update a label
	 * @param {number} labelId Label ID
	 * @param {any}    data    Data object
	 */
	private onLabelUpdate( labelId: number, data: any ): void {
		this.labelDataService.updateLabel( labelId, data) ;
	}

	/**
	 * Delete a label
	 * @param {number} labelId Label ID
	 */
	private onLabelDelete( labelId: number ): void {
		this.labelDataService.deleteLabel( labelId );
	}

}
