var Bookmark = require('../schemaExport.js').Bookmark;
var logger = require('../../adapters/logger.js');


var BookmarksModel = function(userId){

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
					logger.debug('saveBookmark resolved: ' + element.title);
					resolve();
				}
			});
		});
	}

	function sortBookmarksAfterPositionASC(bookmarks){
		return bookmarks.sort(function(a, b){
			return a.position - b.position;
		});
	}

	function moveBookmark(bookmarkId, bookmarkData, callback){
		var bookmarkPromise = self.findOne(bookmarkId);
		bookmarkPromise.then(function(bookmark){
			logger.debug('model moveBookmark: ' + bookmark.title);
			if(bookmarkData.hasOwnProperty('path')){
				bookmark.path = bookmarkData.path;
				logger.debug('set new path');
			}
			if(bookmarkData.hasOwnProperty('position')){
				bookmark.position = bookmarkData.position;
				logger.debug('set new position');
			}

			var deleteBookmarkPromise = self.delete(bookmarkId);
			deleteBookmarkPromise.then(function(){
				var changeNumberOfContainedElementsPromise = caller.changeNumberOfContainedElements(bookmark.path, 1);
				var shiftBookmarksPromise = self.shiftBookmarksPosition(bookmark.path, bookmark.position -1, 1);
				// var shiftFoldersPromise = caller.shiftFoldersPosition(bookmark.path, bookmark.position -1, 1);
				var createBookmarkPromise = Bookmark.create(bookmark);
				// Promise.all([changeNumberOfContainedElementsPromise, shiftBookmarksPromise, shiftFoldersPromise, createBookmarkPromise])
				Promise.all([changeNumberOfContainedElementsPromise, shiftBookmarksPromise, createBookmarkPromise])
				.then(function(){
					logger.debug('moving bookmark was successful');
					callback();
				})
				.catch(callback);
			}) 
			.catch(callback);
		})
		.catch(callback);
	}

	function updateBookmarkLabels(bookmarkId, bookmarkData){
		return new Promise(function(resolve, reject){
			if(bookmarkData.hasOwnProperty('labels')){
				var labels = bookmarkData.labels;
				Bookmark.findById(bookmarkId, function(bookmark, err){
					for(var i = 0; i < labels.length; i++){
						var elementIndex = bookmark.labels.indexOf(labels[i]);
						if(elementIndex < 0){ //element is not in bookmark.labels -> add it
							bookmark.label.push(labels[i]);
						}
						else{ //element is in bookmark.labels -> remove it
							bookmark.label.splice(elementIndex, 1);
						}
					}
					bookmark.save(function(err){
						if(err){
							reject(err);
						}
						else{
							logger.debug('Resolve updateBookmarkLabels');
							resolve();
						}
					});
				});
			}	
			else{
				logger.debug('Resolve updateBookmarkLabels without doing anything');
				resolve();
			}
		});		
	}

	function updateBookmarkEditables(bookmarkId, bookmarkData){
		return new Promise(function(resolve, reject){
			var data = new Object();
			if(bookmarkData.hasOwnProperty('title')){
				data['title'] = bookmarkData.title;
			}
			if(bookmarkData.hasOwnProperty('url')){
				data['url'] = bookmarkData.url;
			}
			if(bookmarkData.hasOwnProperty('description')){
				data['description'] = bookmarkData.description;
			}
			if(bookmarkData.hasOwnProperty('favicon')){
				data['favicon'] = bookmarkData.favicon;
			}
			if(bookmarkData.hasOwnProperty('labels')){
				data['labels'] = bookmarkData.labels;
			}
			Bookmark.findByIdAndUpdate(bookmarkId, data, {new:true}, function(err){
				if(err){
					reject(err);
				}
				else{
					resolve();
				}
			});
		});
	}

	//#### Public Functions ####

	//The startPosition won't be affected, 
	// so if you plan to shift bookmarks to make an get position you have set the startPosition to <planedFreePosition> - 1 
	this.shiftBookmarksPosition = function(path, startPosition, shift){
		logger.debug('Bookmarks Model. Shift Bookmarks');
		return new Promise(function(resolve, reject){
			var allBookmarksPromise = self.findAll(path);
			allBookmarksPromise.then(function(bookmarkArray){
				bookmarkArray = sortBookmarksAfterPositionASC(bookmarkArray);
				var savePromiseArray = new Array(bookmarkArray.length);
				for(var i = 0; i < bookmarkArray.length; i++){
					if(bookmarkArray[i].position > startPosition){
						bookmarkArray[i].position = bookmarkArray[i].position + shift;
						savePromiseArray.push(saveAndReturnPromise(bookmarkArray[i]));
					}
				}
				Promise.all(savePromiseArray).then(function(){
					logger.debug('shifted bookmarks');
					resolve();
				})
				.catch(reject);
			})
			.catch(reject);
		});
	};


	this.create = function(bookmarkData, promises){
		return new Promise(function(resolve, reject){
			bookmarkData['owner'] = self.userId;
			// var checkIfPathRegardsToOwnerPromise = caller.checkIfPathRegardsToOwner(bookmarkData.path);
			// var changeNumberOfContainedElementsPromise = caller.changeNumberOfContainedBookmarks(bookmarkData.path, 1);
			Promise.all(promises).then(function(results){
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

	this.update = function(bookmarkId, bookmarkData, promises){
		logger.debug('model update');
		return new Promise(function(resolve, reject){
			var bookmarkPromise = self.findOne(bookmarkId);
			bookmarkPromise.then(function(bookmark){
				logger.debug("Find update folder: " + bookmark._id);
				//TODO Time update 
				bookmark.updated = new Date();
				logger.debug('updated time: ' + bookmark.updated);
				if(bookmarkData.hasOwnProperty('path') || bookmarkData.hasOwnProperty('position')){
					// logger.debug("Bookmark update Path or Position");
					moveBookmark(bookmarkId, bookmarkData, function(err){
						if(err){
							reject();
						}
						else{
							resolve();
						}
					});					
				}
				else{
					// logger.debug("Change editables");
					// var labelsUpdatePormise = updateBookmarkLabels(bookmarkId, bookmarkData);				
					var editablesUpdatePromise = updateBookmarkEditables(bookmarkId, bookmarkData);
					Promise.all([editablesUpdatePromise]).then(function(){
						resolve();
					})
					.catch(reject);
				}
			})
			.catch(reject);

			// reject(new Error('Failed to upate bookmark. Invalid Input Fields'));
		});
	};

	this.delete = function(bookmarkId){
		logger.debug('model bookmark delete: ' + bookmarkId);
		return new Promise(function(resolve, reject){
			var bookmarkPromise = self.findOne(bookmarkId);
			bookmarkPromise.then(function(bookmark){
				// var shiftFoldersPromise = caller.shiftFoldersPosition(bookmark.path, bookmark.position, -1);
				var shiftBookmarksPromise = self.shiftBookmarksPosition(bookmark.path, bookmark.position, -1);
				var changeNumberOfContainedElementsPromise = caller.changeNumberOfContainedBookmarks(bookmark.path, -1);
				Promise.all([shiftFoldersPromise, shiftBookmarksPromise, changeNumberOfContainedElementsPromise])
				.then(function(results){
					// logger.debug('In the all Promise');
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