var bunyan = require('bunyan');

var logger = bunyan.createLogger({
	name:'stars-web',
	streams:[
		// {
		// 	level: 'debug',
		// 	stream: process.stdout
		// },
		{
			level: 'info',
			stream: process.stdout
		},
		{
			level: 'error',
			path: '/var/tmp/stars-web-error.log'
		}
	]
});

module.exports = logger;