
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'chatApp' })
};

exports.login = function(req, res){
	res.render('login', {title: 'login' })
};

