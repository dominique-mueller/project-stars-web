/**
 * External imports
 */
import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChange } from 'angular2/core';
import { List, Map } from 'immutable';

/**
 * Internal imports
 */
import { BookmarkService, IBookmark } from './../../services/bookmark/bookmark.service';
import { IconComponent } from './../../shared/icon/icon.component';
import { EditableInputComponent } from './../../shared/editable_input/editable_input.component';
import { AssignLabelComponent } from './../../shared/assign_label/assign_label.component';

/**
 * Bookmark details component
 */
@Component( {
	directives: [
		IconComponent,
		EditableInputComponent,
		AssignLabelComponent
	],
	selector: 'app-bookmark-details',
	templateUrl: './bookmark_details.component.html'
} )
export class BookmarkDetailsComponent implements OnInit {

	/**
	 * Visibility flag
	 */
	@Input()
	private visible: boolean;

	/**
	 * Information about the currently selected element
	 */
	@Input()
	private element: Map<string, any>;

	/**
	 * Data of the currently selected element
	 */
	@Input()
	private data: Map<string, any>;

	/**
	 * Labels
	 */
	@Input()
	private labels: List<Map<string, any>>;

	/**
	 * Close event
	 */
	@Output()
	private close: EventEmitter<any>;

	private bookmarkService: BookmarkService;

	private unassignedLabels: any;

	constructor( bookmarkService: BookmarkService ) {

		this.bookmarkService = bookmarkService;

		// Setup
		this.close = new EventEmitter();

	}

	public ngOnInit(): void {
		// TOOD
	}

	/**
	 * Call this when input value change
	 */
	public ngOnChanges( changes: {
		[ key: string ]: SimpleChange,
		labels: SimpleChange
	} ): void {

		// Skip if we have no data yet
		if ( typeof this.labels !== 'undefined' && typeof this.data !== 'undefined' ) {

			// Filter: Get all unassigned labels
			this.unassignedLabels = this.labels.filter( ( label: Map<string, any> ) => {
				return this.data.get( 'labels' ).indexOf( label.get( 'id' ) ) === -1;
			} );

		}

	}

	private closePanel(): void {
		this.close.emit( null );
	}

	/**
	 * Update element
	 * @param {Map<string, any>} element Information about the element
	 * @param {string}           key     Key
	 * @param {string}           value   Updated value
	 */
	private updateElement( element: Map<string, any>, key: string, value: string ): void {

		// Skip of no update

		// Create data
		let data: any = {};
		data[ key ] = value;

		// Update bookmark
		this.bookmarkService.updateBookmark( element.get( 'id' ), data );

	}

	/**
	 * Assign new label to element
	 * @param {Map<string, any>} element  Information about the element
	 * @param {List<number>}     labels   List of currently assigned label ids
	 * @param {number}           newLabel New label id (to be assigned)
	 */
	private assignLabelToElement( element: Map<string, any>, labels: List<number>, newLabel: number ): void {

		// Skip if no update

		// Create data
		let data: any = {};
		data.labels = labels.push( newLabel );

		// Update bookmark
		this.bookmarkService.updateBookmark( element.get( 'id' ), data );

	}

}
