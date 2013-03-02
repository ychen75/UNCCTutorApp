// INDEX
exports.index = function(req, res){
  var username = (req.session.loggedIn) ? req.session.name : 'Not logged in';
  res.render('index', { title: 'Express', username: username});
};

// LOGIN
exports.login = function(req, res){
  req.session.loggedIn = req.session.loggedIn || false;
  if (req.session.loggedIn)
    res.redirect('/');
  else
    res.render('login', {
      title: 'Login Please',
      msg: ""
    });
};