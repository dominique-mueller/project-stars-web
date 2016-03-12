/**
 * Imports
 */
import { Component } from 'angular2/core';
import { ROUTER_DIRECTIVES, RouteConfig } from 'angular2/router';
// import { Observable } from 'rxjs/Observable';
// import { Subscription } from 'rxjs/Subscription';
// import 'rxjs/add/observable/forkJoin';
import { HeaderComponent } from '../header/header.component';
import { BookmarkListComponent } from '../../components/bookmarkList/bookmarkList.component';
import { BookmarkService } from '../../services/bookmark/bookmark.service';

/**
 * Bookmark components
 */
@Component( {
	directives: [ ROUTER_DIRECTIVES, HeaderComponent, BookmarkListComponent ],
	providers: [ BookmarkService ],
	selector: 'app-bookmarks',
	templateUrl: './bookmarks.component.html'
} )
@RouteConfig( [
	{
		component: BookmarkListComponent,
		path: '/**'
	}
] )
export class BookmarksComponent {

	/**
	 * Bookmark service
	 */
	private bookmarkService: BookmarkService;

	/**
	 * Constructor
	 * @param {BookmarkService} bookmarkService Bookmark service
	 */
	constructor( bookmarkService: BookmarkService ) {
		this.bookmarkService = bookmarkService;
	}

}
