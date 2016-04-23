var Bookmark = require('../schemaExport.js').Bookmark;
var logger = require('../../adapters/logger.js');


var BookmarksModel = function(caller, userId){

	var self; //@see: adapters/authentication.js 
	this.userId;

	//#### Private Functions

	function shiftBookmarkssPosition(path, startPosition, shift){
		return new Promise(function(resolve, reject){
			var allBookmarksPromise = self.findAll();
			allBookmarksPromise.then(function(bookmarkArray){
				bookmarkArray = sortBookmarks(bookmarkArray);
				var savePromiseArray = new Array(bookmarkArray.length);
				for(var i = startPosition; i < bookmarkArray.length; i++){
					bookmarkArray[i].position = bookmarkArray[i].position + shift;
					savePromiseArray[i] = saveAndReturnPromise(bookmarkArray[i]);
				}
				Promise.all(savePromiseArray).then(function(){
					resolve();
				})
				.catch(reject);
			})
			.catch(reject);
		});
	}

	function saveAndReturnPromise(element){
		return new Promise(function(resolve, reject){
			element.save(function(err){
				if(err){
					reject(err);
				}
				else{
					resolve();
				}
			});
		});
	}

	function sortBookmarks(bookmarks){
		var sortedBookmarks = new Array(folders.length);
		for(var i = 0; i < bookmarks.length; i++){
			sortedBookmarks[bookmarks[i].position - 1] = bookmarks[i];
		}
		return sortedBookmarks;
	}


	//#### Public Functions ####

	this.create = function(bookmarkData){
		bookmarkData['owner'] = self.userId;
		return new Promise(function(resolve, reject){
			var bookmark = new Bookmark(bookmarkData);
			bookmark.save(function(err, bookmark){
				if(err){
					reject(err);
				}
				else{
					resolve(bookmark);
				}
			})
		});
	}

	this.update = function(bookmarkId, bookmarkData){
		return new Promise(function(resolve, reject){
			if(!(bookmarkData.hasOwnProperty('owner') || bookmarkData.hasOwnProperty('created'))){
				User.findOneAndUpdate(
					{_id:bookmarkId, owner:self.userId},
					bookmarkData, 
					{new:true},
					function(err, updatedBookmark){
						logger.debug('userId::'+userId+'::bookmarkId::'+bookmarkId);
						logger.debug('Bookmark Id: 570d57c170713861341992d5');
						logger.debug('Owner Id: 56f12f02c6ab44a50e881151');
						if(err){
							reject(err);
						}
						else{
							resolve();
						}
					}
				);
			}
			else{
				reject(new Error('Failed to upate bookmark. Invalid Input Fields'));
			}
		});
	}

	this.delete = function(bookmarkId){
		return new Promise(function(resolve, reject){
			User.findOneAndRemove({_id:bookmarkId, owner:self.userId}, function(err, bookmark){
				if(err){
					reject(err);	
				}
				else{
					resolve(bookmark);
				}
			});
		});
	}

	this.findAllInFolder = function(path){
		return new Promise(function(resolve, reject){
			Bookmark.find({'owner':self.userId, 'path':path}, {skip:0,sort:[['position', 'asc']]}, function(err, bookmarks){
				if(err){
					reject(err);
				}
				else{
					resolve(bookmarks);
				}

				// Bookmark.populate(bookmarks, {path: 'position', options: {sort:[['position', 'asc']]}}, function(err2, sortedBookmarks){
				// 	if(err){
				// 		reject(err);
				// 	} 
				// 	else if(err2){
				// 		reject(err2);
				// 	}
				// 	else{
				// 		resolve(sortedBookmarks);
				// 	}
				// });
			});
		});
	}

	this.findOne = function(bookmarkId){
		return new Promise(function(resolve, reject){
			Bookmark.findOne({_id:bookmarkId, owner:self.userId}, function(err, bookmark){
				if(err){
					reject(err);
				} 
				else{
					resolve(bookmark);
				}
			});
		});
	}

	this.findAll = function(){
		return new Promise(function(resolve, reject){
			Bookmark.find({owner:self.userId}, function(err, bookmarks){
				if(err){
					reject(err);
				}
				else{
					// logger.debug("these labels were found: " + JSON.stringify(bookmarks));
					resolve(bookmarks);
				}
			});
		});
	}


	self = this;
	this.userId = userId;

	return this;
}

module.exports = BookmarksModel;