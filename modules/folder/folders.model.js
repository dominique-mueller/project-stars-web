require('es6-promise').polyfill();
var Folder = require('../schemaExport.js').Folder;
var logger = require('../../adapters/logger.js');

module.exports = {

	create = function(folderData, userId){
		return new Promise(function(resolve, reject){	
			var folder = new Folder({
				name: folderData.name,
				owner: userId,
				path: folderData.path,
				position: folderData.position
			});
			folder.save(function(err, folder){
				if(err){
					reject(err);
				}
				else{
					resolve(folder);
				}
			});
		});
	},

	update = function(){

	},

	delete = function(){
		//TODO do not allow to delete root folder
	},

	findOne = function(folderId, userId){
		return new Promise(function(resolve, reject){
			Folder.findOne({_id:folderId, owner:userId}, function(err, folder){
				if(err){
					reject(err);
				} 
				else{
					resolve(label);
				}
			});
		});
	},

	findAll = function(){
		
	}

}