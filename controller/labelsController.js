var logger = require('../adapters/logger.js');
var httpStatus = require('../config.js').httpStatus;
var helpers = require('../helpers/generalHelpers.js');

var LabelsController = function(req, res, authentication){

	var self = this; //@see: adapters/authentication.js 
	this.authentication = authentication;
	var l = require('../modules/label/labels.model.js');
	this.Label = new l(authentication.tokenUserId);
	var b = require('../modules/bookmark/bookmarks.model.js');
	this.Bookmark = new b(authentication.tokenUserId);
	this.req = req;
	this.res = res;
	this.reqBody;


	//CONSTRUCTOR
	if(req.method != 'GET' && req.method != 'DELETE'){
		// this.reqBody = JSON.parse(req.body.data);
		this.reqBody = req.body.data;
	}	


	//#### PRIVATE FUNCTIONS ####


	//#### PUBLIC FUNCTIONS ####

	this.get = function(){
		var labelPromise = self.Label.findOne(self.req.params.label_id);
		labelPromise.then(function(label){
			self.res.json({'data':
				helpers.mongooseObjToFrontEndObj(label)
			});
		})
		.catch(helpers.respondWithError("Failed to get Label"));
	};


	this.getAll = function(){
		var labelsPromise = self.Label.findAll();
		labelsPromise.then(function(labels){
			self.res.json({'data':
				helpers.mongooseObjToFrontEndObj(labels)
			});
		})
		.catch(helpers.respondWithError("Failed to get Labels"));
	};


	this.post = function(){
		logger.debug('CREATE LABEL userId: ' + self.authentication.tokenUserId)
		var createLabelPromise = self.Label.create(self.reqBody);
		createLabelPromise.then(function(label) {
			self.res.json({'data':
				helpers.mongooseObjToFrontEndObj(label)
			});
		})
		.catch(helpers.respondWithError("Failed to create Label"));
	};


	this.put = function(){
		var updatePromise = self.Label.update(self.req.params.label_id, self.reqBody);
		updatePromise.then(function(){
			self.res.status(httpStatus.NO_CONTENT).end();
		})
		.catch(helpers.respondWithError("Failed to update Label"));
	};


	this.delete = function(){
		var deletionPromsie = self.Label.delete(self.req.params.label_id);
		var removeLabelFromBookmarksPromise = self.Bookmark.removeLabelFromBookmarks(self.req.params.label_id);
		Promise.all([deletionPromsie, removeLabelFromBookmarksPromise]).then(function(){
			res.status(httpStatus.NO_CONTENT).end();
		})
		.catch(function(err){
			logger.error('Could not delete label: ' + err);
			res.status(httpStatus.INVALID_INPUT).send('{"error":"Failed to delete Label"}');
		});
	};


	return this;
}


module.exports = LabelsController;
