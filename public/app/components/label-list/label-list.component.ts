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
import { NotifierService } from './../../shared/notifier/notifier.service';
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
	 * Notifier service
	 */
	private notifierService: NotifierService;

	/**
	 * List containing all service subscriptions
	 */
	private serviceSubscriptions: Array<Subscription>;

	/**
	 * Map of labels
	 */
	private labels: Map<string, Label>;

	/**
	 * Label template for a new label
	 */
	private labelTemplate: Label;

	/**
	 * ID of the currently edited label
	 */
	private editedLabelId: string;

	/**
	 * Constructor
	 */
	constructor(
		changeDetector: ChangeDetectorRef,
		labelDataService: LabelDataService,
		dialogConfirmService: DialogConfirmService,
		notifierService: NotifierService
	) {

		// Initialize
		this.changeDetector = changeDetector;
		this.labelDataService = labelDataService;
		this.dialogConfirmService = dialogConfirmService;
		this.notifierService = notifierService;

		// Setup
		this.serviceSubscriptions = [];
		this.labels = Map<string, Label>();
		this.labelTemplate = <Label> Map<string, any>();
		this.editedLabelId = null;

	}

	/**
	 * Call this when the view gets initialized
	 */
	public ngOnInit(): void {

		// Get labels from its service
		const labelDataServiceSubscription: Subscription = this.labelDataService.labels.subscribe(
			( labels: Map<string, Label> ) => {
				this.labels = labels;
				this.changeDetector.markForCheck(); // Trigger change detection
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
	 * @param {string}  labelId Label ID
	 * @param {boolean} status  Edit mode status
	 */
	private onChangeEditMode( labelId: string, status: boolean ): void {
		if ( status ) {
			this.editedLabelId = labelId;
		} else {
			this.editedLabelId = null;
		}
	}

	/**
	 * Create a label
	 * @param {any} newLabel Data for the new label
	 */
	private onLabelCreate( newLabel: any ): void {

		// Try to create the label
		this.labelDataService.addLabel( newLabel )
			.then( ( data: any ) => {
				this.notifierService.notify( 'default', 'Label successfully created.' );
			} )
			.catch( ( error: any ) => {
				this.notifierService.notify( 'default', 'An error occured while creating the label.' );
			} );

	}

	/**
	 * Update a label
	 * @param {string} labelId      Label ID
	 * @param {any}    updatedLabel Updated label data
	 */
	private onLabelUpdate( labelId: string, updatedLabel: any): void {

		// Try to update the label
		this.labelDataService.updateLabel( labelId, updatedLabel )
			.then( ( data: any ) => {
				this.notifierService.notify( 'default', 'Label successfully updated.' );
			} )
			.catch( ( error: any ) => {
				this.notifierService.notify( 'default', 'An error occured while updating the label.' );
			} );

	}

	/**
	 * Delete a label
	 * @param {string} labelId Label ID
	 */
	private onLabelDelete( labelId: string ): void {

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

					// Try to delete the label
					this.labelDataService.deleteLabel( labelId )
						.then( ( data: any ) => {
							this.notifierService.notify( 'default', 'Label successfully deleted.' );
						} )
						.catch( ( error: any ) => {
							this.notifierService.notify( 'default', 'An error occured while deleting the label.' );
						} );

				}
			} );

	}

}
