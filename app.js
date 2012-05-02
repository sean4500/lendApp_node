
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes');

var app = module.exports = express.createServer()
  , io = require('socket.io').listen(app);

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
		};
	};
};

io.sockets.on("connection", function(socket){
	
	// When a user submits their username we push
	// them to the array which stores all current users
	socket.on("login", function(user){
		users.push(user);
		console.log(users);
		
		// Send updated users array to all sockets
		io.sockets.emit("updateUsers", users);
		
	});
	
	socket.on("newChat", function(chat){
		console.log(chat);
		io.sockets.emit("updateChat", chat);
	});
	
	socket.on("logout", function(user){
		if(users){
			users = removeUser(users, user);
			//console.log(users);
			//io.sockets.broadcast.emit(user + 'has left');
			io.sockets.emit("updateUsers", users);
			socket.disconnect();
		} else {
			console.log(users + "no users");
		};
	});

});

var port = process.env.PORT || 3000;

app.listen(port, function(){
	console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});


callback = function(err, result) {};
// var async = require('async')	
