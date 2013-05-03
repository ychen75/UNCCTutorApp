var db = require('../db');
var request = require('request');

// INDEX
exports.index = function(req, res){
  var username = (req.session.loggedIn) ? req.session.user.realname : 'Not logged in';
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
}

// LOGOUT
exports.logout = function(req, res){
  request.post({url: "localhost:3000/logout", body:""}, callback);
}

// MESSAGES
exports.messages = function(req, res) {
  if (req.session.loggedIn) {
    db.Message.findUserMessages(req.session.user._id, function(messages) {
      db.User.find({}, function(err, users) {
        var usernames = [];
        var userIDs = [];
        for (var i = 0; i < users.length; i++) {
          usernames.push(users[i].realname);
          userIDs.push(users[i]._id);
        }
        
        res.render('messages', {
          title: 'Messages',
          messages: messages,
          sourceLabels: usernames,
          sourceValues: userIDs,
          userID: req.session.user._id
        });
      });      
    });
  }
  else res.redirect('/login');
}

// MESSAGE
exports.message = function(req, res){
  if (req.session.loggedIn) {
    db.Message.readyMessage(req.params.id, req.session.user._id, function(data) {
      res.render('message', {
        title: 'Message',
        members: data.members,
        posts: data.posts,
        userID: data.userID,
        messageID: req.params.id
      });      
    });
  }
  else res.redirect('/login');
}

// REGISTER
exports.register = function(req, res) {
  res.render('register', {
    title: 'Register new user'
  });
}

// USER PROFILE
exports.user = function(req, res) {
  db.User.findOne({ name: req.params.user }, function(err, user) {
    if (user) {
      console.log(user);
      res.render('user', {
        title: user.realname,
        user: user
      });
    }
    else
      res.redirect('/');
  });
}

//TEST
exports.test = function(req, res) {
  if (req.session.loggedIn)
    db.User.find({}, function(err, users) {
      var usernames = [];
      var userIDs = [];
      for (var i = 0; i < users.length; i++) {
        usernames.push(users[i].realname);
        userIDs.push(users[i]._id);
      }
      
      res.render('test', {
        title: 'Autocomplete Test',
        sourceLabels: usernames,
        sourceValues: userIDs,
        userID: req.session.user._id,
        msg: ''
      });
    });
  else res.redirect('/login');
}