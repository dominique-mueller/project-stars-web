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
import { DialogConfirmService } from './../../shared/dialog-confirm/dialog-confirm.service';
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
	 * Dialog confirmation service
	 */
	private dialogConfirmService: DialogConfirmService;

	/**
	 * List containing all service subscriptions
	 */
	private serviceSubscriptions: Array<Subscription>;

	/**
	 * Map of labels
	 */
	private labels: Map<number, Label>;

	/**
	 * Label template for a new label
	 */
	private labelTemplate: Label;

	/**
	 * ID of the currently edited label
	 */
	private editedLabelId: number;

	/**
	 * Constructor
	 */
	constructor(
		changeDetector: ChangeDetectorRef,
		labelDataService: LabelDataService,
		dialogConfirmService: DialogConfirmService ) {

		// Initialize
		this.changeDetector = changeDetector;
		this.labelDataService = labelDataService;
		this.dialogConfirmService = dialogConfirmService;

		// Setup
		this.serviceSubscriptions = [];
		this.labels = Map<number, Label>();
		this.labelTemplate = <Label> Map<string, any>();
		this.editedLabelId = null;

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

		// Set label template
		this.labelTemplate = this.labelDataService.getLabelTemplate();

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
	 * Change edited label ID
	 * @param {number}  labelId Label ID
	 * @param {boolean} status  Edit mode status
	 */
	private onChangeEditMode( labelId: number, status: boolean ): void {
		if ( status ) {
			this.editedLabelId = labelId;
		} else {
			this.editedLabelId = null;
		}
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
	 * Create a label
	 * @param {any} data Data object
	 */
	private onLabelCreate( data: any ): void {
		this.labelDataService.addLabel( data );
	}

	/**
	 * Delete a label
	 * @param {number} labelId Label ID
	 */
	private onLabelDelete( labelId: number ): void {

		// Setup confirmation dialog
		let confirmationOptions: any = {
			message: `Please confirm that you want to delete the "${ this.labels.getIn( [ labelId, 'name' ] ) }" label.
				Note that this label will also be removed from every bookmark it currently is assigned to.`,
			noText: 'Cancel',
			title: 'Deleting a label',
			type: 'danger',
			yesText: 'Delete label'
		};

		// Ask for confirmation first
		this.dialogConfirmService.requestConfirmation( confirmationOptions )
			.then( ( answer: boolean ) => {
				if ( answer ) {
					this.labelDataService.deleteLabel( labelId );
				}
			} );

	}

}
