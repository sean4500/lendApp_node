
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes');

var app = module.exports = express.createServer();

// Configuration
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({ secret: 'your secret here' }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes
app.get('/', routes.index);

// Init users & chats arrays
var users = [];
var chats = [];

// Accepts an array & the value to be removed.
var removeUser = function(array, value){
	// Loops through each index of the array
	for(var i in array){
		// If it finds a match remove it from the array and return it
		if(array[i] == value){
			array.splice(i,1);
			return array;
		}
	}
};

// When a user logs in they're added to the users array
app.post('/login', function(req, res){
	var username = req.body.user;
	//console.log(username);
	users.push(username);
	//console.log(users);
  	res.json({user: username, online: users});
});

// Adds chat to the chat array
app.post('/chat', function(req, res){
	var chat = req.body.chat;
	chats.push(chat);
	//console.log(chats);
	res.json({chats: chats});
});

// Sends back the current version of 'messages' array
app.get('/update', function(req, res){
	res.json({chats: chats});
});

// Sends back the current version of 'users' array
app.get('/online', function(req, res){
	res.json({onlineUsers: users});
});

// Takes user 'offline' by removing them from the users array
app.post('/logout', function(req, res){
	var user = req.body.user;
	users = removeUser(users, user);
	//console.log(users);
});

var port = process.env.PORT || 3000;

app.listen(port, function(){
	console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});


callback = function(err, result) {}
// var async = require('async')	
