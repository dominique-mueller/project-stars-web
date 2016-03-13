/**
 * Imports
 */
import { Output, Directive, Attribute, ElementRef, DynamicComponentLoader, EventEmitter } from 'angular2/core';
import { Router, RouterOutlet, ComponentInstruction } from 'angular2/router';

@Directive({
	selector: 'app-bookmark-router-outlet'
})
export class BookmarkRouterOutlet extends RouterOutlet {

	@Output()
	private pathChange: EventEmitter<string>;

	constructor(
		_elementRef: ElementRef,
		_loader: DynamicComponentLoader,
		_parentRouter: Router,
		@Attribute('name') nameAttr: string) {
			super(_elementRef, _loader, _parentRouter, nameAttr);
			this.pathChange = new EventEmitter();
	}

	public activate( instruction: ComponentInstruction ): Promise<any> {

		this.pathChange.emit( instruction.urlPath );

		return super.activate( instruction );

	}

}
