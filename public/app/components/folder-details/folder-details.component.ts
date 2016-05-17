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
	 * List containing all service subscriptions
	 */
	private serviceSubscriptions: Array<Subscription>;

	/**
	 * Current folder ID
	 */
	private folderId: number;

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
		dialogConfirmService: DialogConfirmService ) {

		// Initialize services
		this.router = router;
		this.changeDetector = changeDetector;
		this.uiService = uiService;
		this.folderDataService = folderDataService;
		this.folderLogicService = folderLogicService;
		this.dialogConfirmService = dialogConfirmService;

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
		// Pre-filter: If the ID is not a number, we navigate back
		if ( curr.parameters.hasOwnProperty( 'id' ) && /^\d+$/.test( curr.parameters[ 'id' ] ) ) {
			this.folderId = parseInt( curr.parameters[ 'id' ], 10 );
		} else {
			this.onClose();
		}

	}

	/**
	 * Call this when the view gets initialized
	 * We do NOT land here if we have been thrown out in the 'routerOnActive' function above
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
		const folderId: number = ( this.folder !== null && this.folder.size > 0 ) ? this.folder.get( 'path' ) : 0;
		this.isVisible = false;
		setTimeout(
			() => {
				this.router.navigate( [ 'bookmarks', 'view', folderId ] ); // Absolute
			},
			275 // Needs 250, plus some (maybe unnecessary) extra time
		);

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
					let foldersToDelete: Array<number> =
						this.folderLogicService.getRecursiveSubfolderIds( this.allFolders, this.folderId );

					// Delete folder with all its subfolders, and bookmarks contained in them
					this.folderDataService.deleteFolder( this.folderId, foldersToDelete );

				}
			} );

	}

	/**
	 * Update folder attribute
	 * @param {string} attribute Attribute / key
	 * @param {string} newValue  New / updated value
	 */
	private onUpdate( attribute: string, newValue: string ): void {
		this.folderDataService.updateFolderValue( this.folderId, attribute, newValue );
	}

	/**
	 * Move folder into another folder
	 * @param {number} parentFolderId New parent folder ID
	 */
	private onMoveFolder( parentFolderId: number ): void {
		this.onClose();
		this.folderDataService.updateFolderValue( this.folderId, 'path', parentFolderId );
	}

}
