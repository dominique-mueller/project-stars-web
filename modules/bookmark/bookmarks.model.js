var Bookmark = require('../schemaExport.js').Bookmark;
var logger = require('../../adapters/logger.js');

module.exports = {
	
	create: function(bookmarkData, userId){
		bookmarkData['owner'] = userId;
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
	},

	update: function(bookmarkId, bookmarkData, userId){
		return new Promise(function(resolve, reject){
			if(!(bookmarkData.hasOwnProperty('owner') || bookmarkData.hasOwnProperty('created'))){
				User.findOneAndUpdate(
					{_id:bookmarkId, owner:userId},
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
	},

	delete: function(bookmarkId, userId){
		return new Promise(function(resolve, reject){
			User.findOneAndRemove({_id:bookmarkId, owner:userId}, function(err, bookmark){
				if(err){
					reject(err);	
				}
				else{
					resolve(bookmark);
				}
			});
		});
	},

	findAllInFolder: function(path, userId){
		return new Promise(function(resolve, reject){
			Bookmark.find({'owner':userId, 'path':path}, {skip:0,sort:[['position', 'asc']]}, function(err, bookmarks){
				if(err){
					reject(err);
				}
				else{
					resolve(bookmarks);
				}

				// Bookmark.populate(bookmarks, {path: 'position', options: {sort:[['position', 'asc']]}}, function(err2, sortedBookamrks){
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
	},

	findOne: function(bookmarkId, userId){
		return new Promise(function(resolve, reject){
			Bookmark.findOne({_id:bookmarkId, owner:userId}, function(err, bookmark){
				if(err){
					reject(err);
				} 
				else{
					resolve(bookmark);
				}
			});
		});
	},

	findAll: function(userId){
		return new Promise(function(resolve, reject){
			Bookmark.find({owner:userId}, function(err, bookmarks){
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
}