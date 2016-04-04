
module.exports = {
	waitForUserIdFromPromise: function(userIdPromise){
		userIdPromise.then(userId){
			return userId;
		}
		.catch(err){
			logger.ERROR("catched error in helpers->waitForUserIdFromPromise");
			logger.ERROR(err);
		}
	},

	pleaseSortTheBookmarksIntoTheirFolders: function(bookmarks, folders){
		
	}
}