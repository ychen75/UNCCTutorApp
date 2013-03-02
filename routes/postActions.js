var db = require('../db');

// LOGIN
exports.login = function(req, res) {
  var users = db.User.findOne({name: req.body.username}, function(err, users) {
    if (users)
    {
      req.session.loggedIn = true;
      console.log(users.realname+' logged in.');
      req.session.name = users.realname;
      res.redirect('/');
    }
    else
    {
      res.render('login', {
        title: 'Login Please',
        msg: 'Login failed, try again'
      });
    }
  });
};

// LOGOUT
exports.logout = function(req, res) {
  req.session.loggedIn = false;
  res.redirect('/');
};