var Bookmark = require('../schemaExport.js').Bookmark;
var logger = require('../../adapters/logger.js');


var BookmarksModel = function(caller, userId){

	var self; //@see: adapters/authentication.js 
	this.userId;

	//#### Private Functions

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
		return bookmarks.sort(function(a, b){
			return a.position - b.position;
		});
	}

	//#### Public Functions ####

	this.shiftBookmarksPosition = function(path, startPosition, shift){
		logger.debug('Bookmarks Model. Shift Bookmarks');
		return new Promise(function(resolve, reject){
			var allBookmarksPromise = self.findAll();
			allBookmarksPromise.then(function(bookmarkArray){
				bookmarkArray = sortBookmarks(bookmarkArray);
				var savePromiseArray = new Array(bookmarkArray.length);
				for(var i = 0; i < bookmarkArray.length; i++){
					if(bookmarkArray[i].position < startPosition){
						bookmarkArray[i].position = bookmarkArray[i].position + shift;
						savePromiseArray[i] = saveAndReturnPromise(bookmarkArray[i]);
					}
				}
				Promise.all(savePromiseArray).then(function(){
					logger.debug('Bookmark Model resolved');
					resolve();
				})
				.catch(reject);
			})
			.catch(reject);
		});
	};



	this.create = function(bookmarkData){
		return new Promise(function(resolve, reject){
			bookmarkData['owner'] = self.userId;
			var checkIfPathRegardsToOwnerPromise = caller.checkIfPathRegardsToOwner(bookmarkData.path);
			var changeNumberOfContainedElementsPromise = caller.changeNumberOfContainedElements(bookmarkData.path, 1);
			Promise.all([changeNumberOfContainedElementsPromise, checkIfPathRegardsToOwnerPromise]).then(function(results){
				logger.debug('Model create Bookmark: ' + bookmarkData);
				logger.debug('ALL RESULTS: ' + results[0]);
				bookmarkData['position'] = results[0];
				var bookmark = new Bookmark(bookmarkData);
				bookmark.save(function(err, bookmark){
					if(err){
						logger.debug('Reject Bookmark creation');
						reject(err);
					}
					else{
						logger.debug('Resolve bookmark creation');
						resolve(bookmark);
					}
				});
			})
			.catch(reject);
		});
	};

	this.update = function(bookmarkId, bookmarkData){
		return new Promise(function(resolve, reject){
			var bookmarkPromise = self.findOne(bookmarkId);
			bookmarkPromise.then(function(bookmark){
				bookmark.updated = 
				if(bookmarkData.hasOwnProperty('path') || bookmarkData.hasOwnProperty('position')){
					var moveBookmarkPromise = moveBookmark();
				}
				else{
					//titl, url, description, favicon, updated
					//labels (check if exist)
					var updateIndependentPropertiesPromise = updateIndependentProperties();
					
				}
				
			})
			.catch(reject);

			// reject(new Error('Failed to upate bookmark. Invalid Input Fields'));
		});
	};

	this.delete = function(bookmarkId){
		return new Promise(function(resolve, reject){
			var bookmarkPromise = self.findOne(bookmarkId);
			bookmarkPromise.then(function(bookmark){
				var shiftFoldersPromise = caller.shiftFoldersPosition(bookmark.path, bookmark.position, -1);
				var shiftBookmarksPromise = self.shiftBookmarksPosition(bookmark.path, bookmark.position, -1);
				var changeNumberOfContainedElementsPromsie = changeNumberOfContainedElements(bookmark.path, -1);
				Promise.all([shiftFoldersPromise, shiftBookmarksPromise, changeNumberOfContainedElementsPromsie])
				.then(function(results){
					logger.debug('In the all Promise');
					Bookmark.findByIdAndRemove(bookmarkId, function(err){
						if(err){
							logger.debug('Promise all error');
							reject(err);
						}
						else{
							logger.debug('deletion was successful');
							resolve();
						}
					});
				})
				.catch(function(){
					reject(new Error('Something went wrong durring the deletion of the folder: ' + folderId));
					//TODO Rollback of successful actions
				});
			})
			.catch(reject);
		});
	};

	// this.findAllInFolder = function(path){
	// 	return new Promise(function(resolve, reject){
	// 		Bookmark.find({'owner':self.userId, 'path':path}, {skip:0,sort:[['position', 'asc']]}, function(err, bookmarks){
	// 			if(err){
	// 				reject(err);
	// 			}
	// 			else{
	// 				resolve(bookmarks);
	// 			}

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
	// 		});
	// 	});
	// }

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
	};

	this.findAll = function(path){
		return new Promise(function(resolve, reject){
			// Folder.find({owner:self.userId},{sort:[['position', 'desc']]}, function(err, folders){
			var contrains = {
				owner: self.userId
			};
			if(path){
				contrains['path'] = path;
			}
			Bookmark.find(contrains, function(err, bookmarks){
				if(err){
					reject(err);
				}
				else{
					resolve(bookmarks);
				}
			});
		});
	}; 


	self = this;
	this.userId = userId;

	return this;
}

module.exports = BookmarksModel;