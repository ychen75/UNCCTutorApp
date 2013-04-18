var db = require('../db');

// LOGIN
exports.login = function(req, res) {
  var user = db.User.findOne({name: req.body.username}, function(err, user) {
    if (user)
    {
      req.session.loggedIn = true;
      console.log('%s logged in', user.realname);
      req.session.user = user;
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

// REGISTER
exports.register = function(req, res) {
  var newUser = new db.User({ name: req.body.username, realname: req.body.realname });
  newUser.save(function(err, newUser) {
    req.session.loggedIn = true;
    req.session.user = newUser;
    console.log('New user %s added to database', newUser.realname);
    res.redirect('/');
  });
}

// NEW MESSAGE
exports.newMessage = function(req, res) {
  var members = req.body.members;
  members = members.split(',');
  var query = { $and: [{ subscribers: { $all: members }}, {subscribers: { $size: members.length }}] };
  db.Message.findOne(query, function(err, message) {
    if (message)
      res.redirect('/messages/' + message.id);
    else {
      db.Message.find({},{ id: true }, function(err, messages) {
        var newMsg = new db.Message({ subscribers: members, id: messages.length, posts: [], lastPostAt: new Date() });
        newMsg.save(function(err, newMsg) {
          res.redirect('/messages/' + newMsg.id);
        });
      });
    }
  });
}

// CALENDER
exports.calender = function(req, res) {
  res.render ('calender', {
    title: 'CALENDER NOT OPEN!',
    msg: 'Come back later'
   });
}



// TEST
exports.test = function(req, res) {
  console.log(req.body.members);
  res.render('test', {
    title: 'Autocomplete test',
    sourceLabels: [],
    sourceValues: [],
    msg: ''
  });
}