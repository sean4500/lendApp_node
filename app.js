/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes');

var app = module.exports = express.createServer();
  
var mysql = require('mysql');

// Configuration
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({ secret: 'secret'}));
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

// Triggers when a user loads up the page
/* io.sockets.on("connection", function(socket){ */
var loginTime = new Date();

// Set up DB connection
var connection = mysql.createConnection({
	host     : 'localhost'
  , database : 'borrow'
  , user     : 'borrow'
  , password : '******'

});

// Create connection with DB
connection.connect();

app.post('/login', function(req, res){
	var sql = 'SELECT * FROM users WHERE user = "'+req.body['user']+'" && pass = "'+req.body['pass']+'"';
	connection.query(sql, function(err, rows){
		if(err){
			throw err;
		} else {
			if(rows.length > 0){
				res.json({status: 'ok'});	
			} else {
				res.json({status: 'We couldnt find that user/pass combination in our records.'});
			};	
		};
	});
});

// Get Current	
app.get('/getCurrentItems', function(req, res){
	// Save the sql query to a var
	var sql = 'SELECT * FROM items WHERE returned = 0 ORDER BY date DESC';
	// Send query to the DB
	connection.query(sql, function(err, rows, fields){
		// Check for errors
		if(err){
			throw err;
		};
		var result = '';
		// Loop through each row and build markup around each row field
		for(i in rows) {
			result += '<tr><input type="hidden" name="id" value="'+rows[i].id+'" /><td class="date">'+rows[i].date+'</td><td class="item">'+rows[i].item+'</td><td class="lent_to">'+rows[i].lent_to+'</td><td class="return_date">'+rows[i].date_of_return+'</td><td class="btns"><a class="save" href="#"></a><a class="edit" href="#"></a></td></tr>';
		};
		// Pass the result as an object to the client
		res.json({result: result});
	});
});

// Past
app.get('/getPastItems', function(req, res){
	// Save the sql query to a var
	var sql = 'SELECT * FROM items WHERE returned = 1 ORDER BY date DESC';
	// Send query to the DB
	connection.query(sql, function(err, rows, fields){
		// Check for errors
		if(err){
			throw err;
		};
		var result = '';
		// Loop through each row and build markup around each row field
		for(i in rows) {
			result += '<tr><input type="hidden" name="id" value="'+rows[i].id+'" /><td class="date">'+rows[i].date+'</td><td class="item">'+rows[i].item+'</td><td class="lent_to">'+rows[i].lent_to+'</td><td class="return_date">'+rows[i].date_of_return+'</td><td class="btns"><a class="trash" href="javascript:void(0);"></a></td></tr>';
		};
		// Pass the response as an object to the client
		res.json({result: result});
	});
});

// Add
app.post('/addItem', function(req, res){
	// Save the sql query to a var
	var sql = 'INSERT INTO items (date, item, lent_to, date_of_return) VALUES ("'+req.body['date']+'", "'+req.body['item']+'", "'+req.body['lent_to']+'", "'+req.body['data_of_return']+'")';
	
	connection.query(sql, function(err, rows, fields){
		if(err){
			throw err;
		} else {
			res.json({status: 'ok'});
		};
	});
});

// Update
app.post('/updateItems', function(req, res){
	// If the updated item is marked as returned, we need to the add that status
	// and the date of return to the DB and 
	if(req.body['returned'] == 'true'){
		// Set returned to be 1 or True
		var returned = 1;
		// Set up the query to update the item as returned
		var sql = 'UPDATE items SET date = "'+req.body['date']+'", item = "'+req.body['item']+'", lent_to = "'+req.body['lent_to']+'", date_of_return = "'+req.body['return_date']+'", returned = "'+returned+'", date_returned = "'+req.body['date_returned']+'" WHERE id = "'+req.body['id']+'"';
	} else {
		// If the item wasn't marked as returned, set returned to 0 or False
		var returned = 0;
		// Set up the query to just update the item, not mark it as returned
		var sql = 'UPDATE items SET date = "'+req.body['date']+'", item = "'+req.body['item']+'", lent_to = "'+req.body['lent_to']+'", date_of_return = "'+req.body['return_date']+'", returned = "'+returned+'" WHERE id = "'+req.body['id']+'"';
	};
	// 
	connection.query(sql, function(err, rows, fields){
		if(err){
			throw err;
		} else {
			res.json({status: 'ok'});
		};
	});
});

app.post('/deleteItem', function(req, res){
	var sql = 'DELETE FROM items WHERE id = "'+req.body['id']+'"';
	connection.query(sql, function(err, rows, fields){
		if(err){
			throw err;
		} else {
			res.json({status: 'ok'});
		};
	});
});

var port = process.env.PORT || 3000;

app.listen(port, function(){
	console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});

callback = function(err, result) {};
// var async = require('async')	