var io = require('../app').io
  , db = require('../db');

io.sockets.on('connection', function(socket) {
  socket.on('join', function(room) {
    socket.join(room);
    console.log('Joined ' + room);
    io.sockets.in(room).emit('joined', room);
  });
  
  socket.on('newMsg', function(data) {
    var newPost = {};
    newPost.posterID = data.userID;
    newPost.postText = data.postText;
    newPost.postTime = new Date();
  
    db.Message.findOne({id: data.messageID}, function(err, message) {
      message.posts.push(newPost);
      message.lastPostAt = newPost.postTime;
      message.save();
      console.log(message.lastPostAt);
    });
    
    db.Message.getUser(data.messageID, data.userID, function(user) {
      newPost.poster = user.realname;
      newPost.posterUsername = user.name;
      console.log(user);
      io.sockets.in(data.room).emit('message', newPost);
    });
  });
});
