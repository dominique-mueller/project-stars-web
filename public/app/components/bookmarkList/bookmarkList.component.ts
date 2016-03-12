/**
 * Imports
 */
import { Component, OnInit, OnDestroy } from 'angular2/core';
import { Router, RouteParams } from 'angular2/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/observable/forkJoin';
import { BookmarkService } from '../../services/bookmark/bookmark.service';

@Component( {
	selector: 'app-bookmark-list',
	templateUrl: './bookmarkList.component.html'
} )
export class BookmarkListComponent implements OnInit, OnDestroy {

	/**
	 * Router service
	 */
	private router: Router;

	/**
	 * Route params service
	 */
	private routeParams: RouteParams;

	/**
	 * Bookmark service
	 */
	private bookmarkService: BookmarkService;

	/**
	 * Service subcription
	 */
	private serviceSubscription: Subscription;

	/**
	 * Current folder path
	 */
	private currentPath: string;

	/**
	 * Bookmarks
	 */
	private bookmarks: any;

	/**
	 * Folders
	 */
	private folders: any;

	/**
	 * Constructor
	 * @param {Router}          router          Router service
	 * @param {RouteParams}     routeParams     Route params service
	 * @param {BookmarkService} bookmarkService Bookmark service
	 */
	constructor( router: Router, routeParams: RouteParams, bookmarkService: BookmarkService ) {
		this.router = router;
		this.routeParams = routeParams;
		this.bookmarkService = bookmarkService;
	}

	/**
	 * Call this when the view gets initialized
	 */
	public ngOnInit(): void {

		// TODO: Show a loading animation

		// Setup bookmark and label subscriptions
		this.serviceSubscription = Observable
			.forkJoin(
				this.bookmarkService.bookmarks
			)
			.subscribe(
				( data: any[] ) => {

					// Read, fix and set route param (which is going to be the current bookmarks subroute)
					let routeParam: string = this.routeParams.get( '*' ); // This can either be null or a string
					if ( routeParam === null ) {
						this.currentPath = '';
					} else {
						this.currentPath = routeParam;
					}

					// Set data for this route
					this.setData( data[ 0 ] );

				},
				( error: any ) => {
					console.log( 'Component error message' ); // TODO
				}
			);

		// Update the data on every route init
		this.bookmarkService.getBookmarks();

	}

	/**
	 * Call this when the view gets destroyed
	 */
	public ngOnDestroy(): void {

		// Unsubscribe from all services
		this.serviceSubscription.unsubscribe();

	}

	/**
	 * Set data for the route / view
	 * @param {any[]} data Data from the bookmark service
	 */
	private setData( data: any[] ): void {

		// Setup default path position (root folder)
		let currentPathPosition: number = 0;

		// Get current path position in dataset
		if ( this.currentPath !== '' ) {

			// Iterate through all paths (except the root which is the first one)
			let numberOfPaths: number = data.length;
			for ( let i: number = numberOfPaths - 1; i >= 1; i-- ) {
				if ( this.currentPath === data[ i ].path.join( '/' ) ) {
					currentPathPosition = i;
					break;
				}
			}

			// If we couldn't find a path then the path does not exist - we are thrown out
			if ( currentPathPosition === 0 ) {
				this.router.navigateByUrl( 'bookmarks' ); // TODO: Maybe show a notification ?
			}

		}

		// Set data
		this.bookmarks = data[ currentPathPosition ].bookmarks;
		this.folders = data[ currentPathPosition ].folders;

	}

	/**
	 * Navigate to another route
	 * @param {string} folderName Name of the subfolder
	 */
	private navigate( folderName: string ): void {

		// Create new router url
		let url: string;
		if ( this.currentPath === '' ) {
			url = `bookmarks/${ folderName }`;
		} else {
			url = `bookmarks/${ this.currentPath }/${ folderName }`;
		}

		// Navigate to the created url
		this.router.navigateByUrl( url );

	}

}
