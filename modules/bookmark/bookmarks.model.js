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
		// var sortedBookmarks = new Array(folders.length);
		// for(var i = 0; i < bookmarks.length; i++){
		// 	sortedBookmarks[bookmarks[i].position - 1] = bookmarks[i];
		// }
		// return sortedBookmarks;
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
	};

	this.update = function(bookmarkId, bookmarkData){
		
		// return new Promise(function(resolve, reject){
		// 	if(folderData.hasOwnProperty('name')){
		// 		Folder.findByIdAndUpdate(folderId, {"name":folderData.name}, {new:true}, function(err){
		// 			if(err){
		// 				reject(err);
		// 			}
		// 			else{
		// 				resolve();
		// 			}
		// 		});
		// 	}
		// 	else{
		// 		moveFolder(folderId, folderData, function(err){
		// 			if(err){
		// 				reject();
		// 			}
		// 			else{
		// 				resolve();
		// 			}
		// 		});
		// 	}
		// });





		// return new Promise(function(resolve, reject){
		// 	if(!(bookmarkData.hasOwnProperty('owner') || bookmarkData.hasOwnProperty('created'))){
		// 		User.findOneAndUpdate(
		// 			{_id:bookmarkId, owner:self.userId},
		// 			bookmarkData, 
		// 			{new:true},
		// 			function(err, updatedBookmark){
		// 				logger.debug('userId::'+userId+'::bookmarkId::'+bookmarkId);
		// 				logger.debug('Bookmark Id: 570d57c170713861341992d5');
		// 				logger.debug('Owner Id: 56f12f02c6ab44a50e881151');
		// 				if(err){
		// 					reject(err);
		// 				}
		// 				else{
		// 					resolve();
		// 				}
		// 			}
		// 		);
		// 	}
		// 	else{
		// 		reject(new Error('Failed to upate bookmark. Invalid Input Fields'));
		// 	}
		// });
		

		return new Promise(function(resolve, reject){
			resolve();
		});
	};

	this.delete = function(bookmarkId){
		return new Promise(function(resolve, reject){
			var bookmarkPromise = self.findOne(bookmarkId);
			bookmarkPromise.then(function(bookmark){
				var shiftFoldersPromise = caller.shiftFoldersPosition(bookmark.path, bookmark.position, -1);
				var shiftBookmarksPromise = self.shiftBookmarksPosition(bookmark.path, bookmark.position, -1);
				var alterPathPromise = changeNumberOfContainedElements(bookmark.path, -1);
				Promise.all([shiftFoldersPromisey, shiftBookmarksPromise, alterPathPromise]).then(function(resolveArray){
					Folder.findByIdAndRemove(bookmarkId, function(err){
						if(err){
							logger.debug('Promise all error');
							reject(err);
						}
						else{
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

	// this.findAll = function(){
	// 	return new Promise(function(resolve, reject){
	// 		Bookmark.find({owner:self.userId}, function(err, bookmarks){
	// 			if(err){
	// 				reject(err);
	// 			}
	// 			else{
	// 				// logger.debug("these labels were found: " + JSON.stringify(bookmarks));
	// 				resolve(bookmarks);
	// 			}
	// 		});
	// 	});
	// }
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