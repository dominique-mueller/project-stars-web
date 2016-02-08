var bunyan = require('bunyan');
var fs = require('fs');
var os = require('os');
var logPath = createLogPath();

//configure bunyan logger
var logger = bunyan.createLogger({
	name:'stars-web',
	streams:[
		{
			level: 'debug',
			stream: process.stdout
		},
		{
			level: 'info',
			stream: process.stdout
		},
		{
			level: 'error',
			path: logPath+'error.log'
		}
	]
});

module.exports = logger;



//#### Functions and Methods ####

/*
	@return: returns the log path depending on the os. Creates the log path if it does not exist 
	checking the OS to determine the log file path
	mac os is not supportet
*/
function createLogPath(){
	if(os.platform() === 'linux'){
		//os is linux
		logPath = '/var/log/stars-web/';
		createDirPath(logPath);
	}
	else{
		//os is windows
		logPath = 'C:\\stars-web\\';
		createDirPath(logPath);
	}
}

/*
	@param: the path as String which shall be created
	Nothing will happen, if the path allready exist. 
	If not, the path will be created.
*/
function createDirPath(path){
	try{ 
		//check if path allready exists
		fs.lstatSync(logPath).isDirectory();
	}	
	catch(e){ 
		//if path does not exist, create it
		fs.mkdirSync(logPath);		
	}
}



//http://stackoverflow.com/questions/4482686/check-synchronously-if-file-directory-exists-in-node-js

// var fs = require('fs');
// try {
//     // Query the entry
//     stats = fs.lstatSync('/the/path');

//     // Is it a directory?
//     if (stats.isDirectory()) {
//         // Yes it is
//     }
// }
// catch (e) {
//     // ...
// }