
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

var users = [];
var messages = [];

// Forms
app.post('/login', function(req, res){
	var username = req.body.user;
	console.log(username);
	
	users.push(username);
	
	console.log(users);
	
  	res.json({user: username, online: users});
});

app.post('/chat', function(req, res){
	var chat = req.body.chat;
	
	messages.push(chat);
	console.log(messages);
	
	res.json({messages: messages});
	
});

app.get('/update', function(req, res){
	res.json({messages: messages});
});

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);

callback = function(err, result) {}
// var async = require('async')	
