/**
 * File: Bookmark Directory component
 */

import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, OnChanges, SimpleChange, ChangeDetectorRef,
	ChangeDetectionStrategy } from '@angular/core';
import { Subscription } from 'rxjs';
import { List, Map } from 'immutable';

import { Folder, FolderLogicService } from './../../services/folder';
import { UiService } from './../../services/ui';
import { IconComponent } from './../../shared';

/**
 * View component (dumb and partially smart, recursive): Bookmark directory
 */
@Component( {
	changeDetection: ChangeDetectionStrategy.OnPush,
	directives: [
		BookmarkDirectoryComponent,
		IconComponent
	],
	host: {
		class: 'directory'
	},
	selector: 'app-bookmark-directory',
	templateUrl: 'bookmark-directory.component.html'
} )
export class BookmarkDirectoryComponent implements OnInit, OnDestroy, OnChanges {

	/**
	 * Input: List of all folders (just piped through the whole directory hierarchy, from top to bottom)
	 */
	@Input()
	private folders: List<Folder>;

	/**
	 * Input: ID of the parent folder
	 */
	@Input()
	private parentFolderId: string;

	/**
	 * Output: Select event, emits folder ID
	 */
	@Output()
	private selectFolder: EventEmitter<string>;

	/**
	 * Change detector
	 */
	private changeDetector: ChangeDetectorRef;

	/**
	 * Internal: Folder logic service
	 */
	private folderLogicService: FolderLogicService;

	/**
	 * UI service
	 */
	private uiService: UiService;

	/**
	 * List containing all subscriptions
	 */
	private serviceSubscriptions: Array<Subscription>;

	/**
	 * Internal: List of subfolders living inside this (the current) directory layer
	 */
	private subfolders: List<Folder>;

	/**
	 * Internal: ID of the currently opened folder
	 */
	private openedFolderId: string;

	/**
	 * Constructor
	 * @param {ChangeDetectorRef}  changeDetector     Change detector
	 * @param {FolderLogicService} folderLogicService Folder logic service
	 * @param {UiService}          uiService          UI service
	 */
	constructor(
		changeDetector: ChangeDetectorRef,
		folderLogicService: FolderLogicService,
		uiService: UiService
	) {

		// Initialize
		this.changeDetector = changeDetector;
		this.folderLogicService = folderLogicService;
		this.uiService = uiService;

		// Setup
		this.folders = List<Folder>();
		this.parentFolderId = null;
		this.selectFolder = new EventEmitter<string>();
		this.subfolders = List<Folder>();
		this.serviceSubscriptions = [];
		this.openedFolderId = null;

	}

	/**
	 * Call this when the view gets initialized
	 */
	public ngOnInit(): void {

		// Get informed when the opened folder changes so that we can update the directory view
		// For example, this could come from the bookmark list component
		const uiServiceSubscription: Subscription = this.uiService.uiState.subscribe(
			( uiState: Map<string, any> ) => {

				// Update opened folder (only when the value actually changed)
				if ( uiState.get( 'openedFolderId' ) !== this.openedFolderId ) {
					this.openedFolderId = uiState.get( 'openedFolderId' );
					this.changeDetector.markForCheck(); // Trigger change detection
				}

			}
		);

		// Save subscriptions
		this.serviceSubscriptions = [
			uiServiceSubscription
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
	 * Watch for input value updates
	 */
	public ngOnChanges( changes: {
		[ key: string ]: SimpleChange,
		folders: SimpleChange
	} ): void {

		// Get / update the subfolders of this (the current) directory layer
		// But only do this when the folders actually changed (skip the initial change)
		if ( changes.hasOwnProperty( 'folders' ) && changes.folders.currentValue.size > 0 ) {
			this.subfolders = this.folderLogicService
				.getSubfoldersByFolderId( changes.folders.currentValue, this.parentFolderId );
		}

	}

	/**
	 * Handle click on a folder element (but only when the selected folder is not already the currently opened one)
	 * We simply pipe the event through to the top until we reach the bookmarks component which then handles the navigation
	 * @param {string} folderId Folder ID
	 */
	private onSelectFolder( folderId: string ): void {
		if ( folderId !== this.openedFolderId ) {
			this.selectFolder.emit( folderId );
		}
	}

}
