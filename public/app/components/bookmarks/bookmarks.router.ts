/**
 * External imports
 */
import { Output, Directive, Attribute, ElementRef, DynamicComponentLoader, EventEmitter } from 'angular2/core';
import { Router, RouterOutlet, ComponentInstruction } from 'angular2/router';

/**
 * Custom bookmark router outlet
 */
@Directive({
	selector: 'app-bookmark-router-outlet'
})
export class BookmarkRouterOutlet extends RouterOutlet {

	/**
	 * Path change event emitter
	 */
	@Output()
	private pathChange: EventEmitter<string>;

	/**
	 * Constructor
	 */
	constructor(
		elementRef: ElementRef,
		loader: DynamicComponentLoader,
		parentRouter: Router,
		@Attribute( 'name' ) nameAttr: string ) {
			super( elementRef, loader, parentRouter, nameAttr );
			this.pathChange = new EventEmitter();
	}

	/**
	 * We step into the moment when the route gets activated and emit the path change event
	 */
	public activate( instruction: ComponentInstruction ): Promise<any> {

		// this.pathChange.emit( instruction.urlPath.split( '/;' )[ 0 ] );

		// Emit pathChange event (to router outlet parent component)
		this.pathChange.emit( instruction.urlPath );

		// Continues
		return super.activate( instruction );

	}

}
