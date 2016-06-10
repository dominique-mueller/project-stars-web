/**
 * External imports
 */
import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Router, RouteSegment, RouteTree, OnActivate } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { List } from 'immutable';

/**
 * Internal imports
 */
import { UiService } from './../../services/ui';
import { Folder, FolderDataService, FolderLogicService } from './../../services/folder';
import { DialogConfirmService } from './../../shared/dialog-confirm/dialog-confirm.service';
import { NotifierService } from './../../shared/notifier/notifier.service';
import { IconComponent } from './../../shared/icon/icon.component';
import { EditableInputComponent } from './../../shared/editable-input/editable-input.component';
import { MoveIntoFolderComponent } from './../../shared/move-into-folder/move-into-folder.component';

/**
 * View component (smart): Folder details
 * Sidenote: Very similar to the BookmarkDetailsComponent
 */
@Component( {
	changeDetection: ChangeDetectionStrategy.OnPush,
	directives: [
		IconComponent,
		EditableInputComponent,
		MoveIntoFolderComponent
	],
	templateUrl: './folder-details.component.html'
} )
export class FolderDetailsComponent implements OnActivate, OnInit, OnDestroy {

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
	 * Folder data service
	 */
	private folderDataService: FolderDataService;

	/**
	 * Folder logic service
	 */
	private folderLogicService: FolderLogicService;

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
	 * Current folder ID
	 */
	private folderId: string;

	/**
	 * Current folder
	 */
	private folder: Folder;

	/**
	 * List of all folders
	 */
	private allFolders: List<Folder>;

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
		folderDataService: FolderDataService,
		folderLogicService: FolderLogicService,
		dialogConfirmService: DialogConfirmService,
		notifierService: NotifierService
	) {

		// Initialize services
		this.router = router;
		this.changeDetector = changeDetector;
		this.uiService = uiService;
		this.folderDataService = folderDataService;
		this.folderLogicService = folderLogicService;
		this.dialogConfirmService = dialogConfirmService;
		this.notifierService = notifierService;

		// Setup
		this.serviceSubscriptions = [];
		this.folderId = null;
		this.folder = null;
		this.allFolders = List<Folder>();
		this.isVisible = false;

	}

	/**
	 * Call this when the router gets activated
	 * This function only handles stuff that has to do with routing
	 */
	public routerOnActivate( curr: RouteSegment, prev?: RouteSegment, currTree?: RouteTree, prevTree?: RouteTree ): void {

		// Get folder ID from the route URL
		this.folderId = curr.parameters[ 'id' ];

	}

	/**
	 * Call this when the view gets initialized
	 */
	public ngOnInit(): void {

		// Get folders from its service, then find the right one
		const folderDataServiceSubscription: Subscription = this.folderDataService.folders.subscribe(
			( folders: List<Folder> ) => {
				if ( folders.size > 0 ) {

					// Save all folders (necessary for deletion later on)
					this.allFolders = folders;

					// Try to find the correct folder
					this.folder = this.folderLogicService.getFolderByFolderId( folders, this.folderId );

					// Navigate back if the folder doesn't exist
					if ( this.folder === null ) {
						this.onClose();
					} else {

						// Convert date strings into date objects (for view only, makes the date pipe work properly)
						this.folder = <Folder> this.folder.set( 'created', new Date( this.folder.get( 'created' ) ) );
						if ( this.folder.get( 'updated' ) !== null ) {
							this.folder = <Folder> this.folder.set( 'updated', new Date( this.folder.get( 'updated' ) ) );
						}

						// Update UI state
						// This should notify other components, like the bookmark list one
						this.uiService.setSelectedElement( 'folder', this.folderId );
						this.changeDetector.markForCheck(); // Trigger change detection

					}

				}
			}
		);

		// Save subscriptions
		this.serviceSubscriptions = [
			folderDataServiceSubscription
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
	 * Close the details panel
	 */
	private onClose(): void {

		// Remove especially the bookmark data service subscription
		// Otherwise the current bookmark will be deleted and later on (after the timeout) we cannot get the path
		this.ngOnDestroy();

		// Update UI state
		// This should notify other components, like the bookmark list one
		this.uiService.unsetSelectedElement();

		// Animate out, navigate when animation is done
		if ( this.folder !== null && this.folder.size > 0 ) {
			this.isVisible = false;
			setTimeout(
				() => {
					this.router.navigate( [ 'bookmarks', 'view', this.folder.get( 'path' ) ] ); // Absolute
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
	 * Delete folder
	 */
	private onDelete(): void {

		// Setup confirmation dialog
		let confirmationOptions: any = {
			message: `Please confirm that you want to delete the "${ this.folder.get( 'name' ) }" folder.
				Note that all folders and bookmarks that exist inside this folder will also be deleted.`,
			noText: 'Cancel',
			title: 'Deleting a folder',
			type: 'danger',
			yesText: 'Delete folder'
		};

		// Ask for confirmation first
		this.dialogConfirmService.requestConfirmation( confirmationOptions )
			.then( ( answer: boolean ) => {
				if ( answer ) {
					this.onClose();

					// Get all subfolders of the folder we want to delete
					let foldersToDelete: Array<string> =
						this.folderLogicService.getRecursiveSubfolderIds( this.allFolders, this.folderId );

					// Try to delete the folder with all its subfolders, and bookmarks contained in them
					this.folderDataService.deleteFolder( this.folderId, foldersToDelete )
						.then( ( data: any ) => {
							this.notifierService.notify( 'default', 'Folder successfully deleted.' );
						} )
						.catch( ( error: any ) => {
							this.notifierService.notify( 'default', 'An error occured while deleting the folder.' );
						} );

				}
			} );

	}

	/**
	 * Update folder attribute
	 * @param {string} attribute Attribute / key
	 * @param {string} newValue  New / updated value
	 */
	private onUpdate( attribute: string, newValue: string ): void {

		// Create updated data
		let updatedFolder: any = {};
		updatedFolder[ attribute ] = newValue;

		// Try to update the folder
		this.folderDataService.updateFolder( this.folderId, updatedFolder )
			.then( ( data: any ) => {
				this.notifierService.notify( 'default', 'Folder successfully updated.' );
			} )
			.catch( ( error: any ) => {
				this.notifierService.notify( 'default', 'An error occured while updating the folder.' );
			} );

	}

	/**
	 * Move folder into another folder
	 * @param {string} parentFolderId New parent folder ID
	 */
	private onMoveFolder( parentFolderId: string ): void {
		this.onClose();

		// Create updated data
		let updatedFolder: any = {
			path: parentFolderId
		};

		// Try to update the folder
		this.folderDataService.updateFolder( this.folderId, updatedFolder )
			.then( ( data: any ) => {
				this.notifierService.notify( 'default', 'Folder successfully moved into another folder.' );
			} )
			.catch( ( error: any ) => {
				this.notifierService.notify( 'default', 'An error occured while moving the folder into another folder.' );
			} );

	}

}
