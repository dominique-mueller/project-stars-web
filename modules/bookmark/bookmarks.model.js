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


	this.create = function(bookmarkData, position){
		return new Promise(function(resolve, reject){
			bookmarkData['owner'] = self.userId;
			bookmarkData['position'] = position;
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
			// })
			// .catch(reject);
		});
	};


	this.updateBookmarkEditables = function(bookmarkId, bookmarkData){
		return new Promise(function(resolve, reject){
			//That cumbersome because of error prevention at bookmark save
			//JS would create a new Filed instead of rejecting non existing keys -> invalid bookmark schema
			var bookmarkPromise = self.findOne(bookmarkId);
			bookmarkPromise.then(function(bookmark){
				logger.debug("UPDATE THIS BOOKMARK: " + bookmark);
				if(bookmarkData.hasOwnProperty('title')){
					bookmark['title'] = bookmarkData.title;
				}
				if(bookmarkData.hasOwnProperty('url')){
					bookmark['url'] = bookmarkData.url;
				}
				if(bookmarkData.hasOwnProperty('description')){
					bookmark['description'] = bookmarkData.description;
				}
				if(bookmarkData.hasOwnProperty('favicon')){
					bookmark['favicon'] = bookmarkData.favicon;
				}
				if(bookmarkData.hasOwnProperty('labels')){
					bookmark['labels'] = bookmarkData.labels;
				}
				bookmark.save(function(err){
					if(err){
						reject(err);
					}
					else{
						resolve();
					}
				});

			})
			.catch(function(err){
				logger.error('An error occured in bookmarks.model.update when trying to find the bookmark:' + err);
			});
		});
	};


	this.updateMoveBookmarksFolderOrPosition = function(bookmarkId, bookmarkData){
		return new Promise(function(resolve, reject){
			var promiseList = new Array();
			var bookmarkPromise = self.findOne(bookmarkId);
			bookmarkPromise.then(function(bookmark){
				logger.debug('model moveBookmark: ' + bookmark.title);
				
				if(bookmarkData.hasOwnProperty('path')){
					promiseList.push(self.shiftBookmarksPosition(bookmark.path, bookmark.position, -1));
					bookmark.path = bookmarkData.path;
					logger.debug('set new path');
				}
				// if(bookmarkData.hasOwnProperty('position')){
				bookmark.position = bookmarkData.position;
					// logger.debug('set new position');
				// }

				promiseList.push(self.shiftBookmarksPosition(bookmark.path, bookmark.position -1, 1));
				Promise.all(promiseList).then(function(results){
					logger.debug('moving bookmark was successful');
					saveAndReturnPromise(bookmark).then(function(){
						resolve();
					})
					.catch(reject);
				}) 
				.catch(reject);
			})
			.catch(function(err){
				logger.error('An error occured in bookamarks.model.update when trying to find the bookmark:' + err);
			});
		});
	};


	this.delete = function(bookmarkId){
		logger.debug('model bookmark delete: ' + bookmarkId);
		return new Promise(function(resolve, reject){
			var bookmarkPromise = self.findOne(bookmarkId);
			bookmarkPromise.then(function(bookmark){
				var shiftBookmarksPromise = self.shiftBookmarksPosition(bookmark.path, bookmark.position, -1);
				shiftBookmarksPromise.then(function(){
					Bookmark.findByIdAndRemove(bookmarkId, function(err){
						if(err){
							logger.debug('Promise all error');
							reject(err);
						}
						else{
							resolve(bookmark);
						}
					});
				})
				.catch(reject);
			})
			.catch(reject);
		});
	};

	this.findOne = function(bookmarkId){
		return new Promise(function(resolve, reject){
			Bookmark.findOne({_id: bookmarkId, owner: self.userId}, function(err, bookmark){
				if(err){
					reject(err);
				} 
				else{
					resolve(bookmark);
				}
			});
		});
	};

	//@param path: if path is given, this function will only search for bookmarks within this path
	this.findAll = function(path){
		return new Promise(function(resolve, reject){
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


	this.removeLabelFromBookmarks = function(labelId){
		return new Promsie(function(resolve, reject){
			var promiseList = new Array();
			var bookmarkPromise = self.Bookmark.findAll().then(function(bookmarks){
				for(var i = 0; i < bookmark.length; i++){
					var labelIndex = bookmarks[i].indexOf(labelId);
					if(labelIndex > -1){
						bookmarks[i].splice(labelIndex, 1);
						promiseList.push(saveAndReturnPromise(bookmarks[i]));
					}
				}
				Promise.all(promiseList).then(function(){
					resolve();
				})
				.catch(reject);
			})
			.catch(reject);
		});
	}



	self = this;
	this.userId = userId;

	return this;
}

module.exports = BookmarksModel;