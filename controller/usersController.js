
function usersController(req, res){
	var User = require('../modules/schemaExport.js').User;
	var this.req, this.res;

	if(req && res){
		this.req, this.res = req, res;
	}
	else{
		this.req, this.res = null, null;
	}

	function setControllerAttributes(req, res){
		this.req, this.res = req, res;
	}
	function checkReqRes(){
		
	}

	function get(param){
		if(param){
			getOne(userId);
		}
		else{
			getAll();
		}
	}
 
	function post(){

	}

	function put(){

	}

	function delete(){

	}
}

usersController.prototype.getAll = function(){

}

usersController.prototype.getOne = function(userId){

}

usersController.prototype.deactivate = function(userId){

}

module.exports = usersController;
// module.exports = {
// 	'get': function(param){
// 		if(param){
// 			getOne(userId);
// 		}
// 		else{
// 			getAll();
// 		}
// 	},
	
// 	'post': function(){

// 	},

// 	'put': function(){

// 	},

// 	'delete': function(){

// 	}
// }

//##### Private Functions #####

function getAll(){

}

function getOne(userId){

}