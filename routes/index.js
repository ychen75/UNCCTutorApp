var db = require('../db');
var helper = require('../helper/helper.js');

// Variables common to all pages
header = function(req, res) {
  username = (req.session.loggedIn) ? req.session.user.realname : 'Not logged in';
};

// INDEX
exports.index = function(req, res){
  res.render('index', header(req, res));
};

// LOGIN
exports.login = function(req, res){
  if (req.session.loggedIn)
    res.redirect('/');
  else
    var obj = helper.merge(header(req, res), {msg: "Username doesn't exist"});
    res.render('login', obj);
}

// REGISTER
exports.register = function(req, res) {
  var obj = helper.merge(header(req, res), {msg: ""});
  res.render('register', obj);
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
  else res.redirect('/login', header(req,res));
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