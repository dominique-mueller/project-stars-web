require('es6-promise').polyfill();
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

	update = function(bookmarkData, userId){
		return new Promise(function(resolve, reject){
			if(!(bookmarkData.hasOwnProperty('owner') || bookmarkData.hasOwnProperty('created'))){
				User.findOneAndUpdate(
					{_id:bookmarkData._id, owner:userId},
					bookmarkData, 
					{new:true}
					function(err){
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
				reject(new Error('Failed to upate bookmark. Invalid Input Fields'))
			}
		});
	},

	delete = function(bookmarkId, userId){
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

	find = function(data){
		
	},

	findOne = function(bookmarkId, userId){
		return new Promise(function(resolve, reject){
			Bookmark.findOne({_id:bookmarkId, owner:userId}, function(err, bookmark){
				if(err){
					reject(err);
				} 
				else{
					resolve(label);
				}
			});
		});
	},

	findAll = function(userId){
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