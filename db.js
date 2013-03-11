var mongoose = require('mongoose');
var conf = {
  db: {
    db: 'mydb',
    host: 'localhost'
  },
  secret: '0adsfieure3e8uds9f8d9fs8u'
};

// Connect to mongodb databases stored on the localhost and use the database named 'test'
var dbUrl = 'mongodb://';
dbUrl += conf.db.host+':'+conf.db.port;
dbUrl += '/' + conf.db.db;
mongoose.connect(dbUrl);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', function callback() {
  // Anything that needs to be run each time the server is started
  console.log('Database connection: OK');
});

// SCHEMAS
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var userSchema = new Schema({
  name: String,
  realname: String,
  isTutor: Boolean,
  messages: [{type: ObjectId, ref: 'Message'}],
  schedule: [{type: ObjectId, ref: 'Event'}]
}, { collection: 'users' });

var User = mongoose.model('User', userSchema);

var messageSchema = new Schema({
  id: Number,
  subscribers: [{type: ObjectId, ref: 'User'}],
  lastPostAt: Date,
  posts: [{
    posterID: Number,
    postText: String,
    postTime: Date
  }],
}, { collection: 'messages' });

messageSchema.virtual('lastPost').get(function() {
  return this.posts[this.posts.length - 1];
});

messageSchema.statics.readyMessage = function(messageID, user_ID, callback) {
  this.findOne({id: messageID}).populate('subscribers').exec(function(err, message) {
    var data = {};
    for (var i = 0; i < message.subscribers.length; i++)
      if (message.subscribers[i]._id == user_ID) 
        data.userID = i;
        
        
      var memberNames = [];
      for (var x = 0; x < message.subscribers.length; x++)
        memberNames.push(message.subscribers[x].realname);
        
      var numNames = memberNames.length;
      data.members = "Conversation between ";
      if (numNames === 1)
        data.members = 'Yourself';
      else if (numNames === 2)
        data.members += memberNames[0] + " and " + memberNames[1];
      else {
        for (var x = 0; x < numNames - 1; x++)
          data.members += memberNames[x] + ", ";
        data.members += "and " + memberNames[numNames - 1];
      }
        
    console.log(data.userID);
    data.posts = message.posts;
    for (var i = 0; i < message.posts.length; i++)
    {
      var posterID = message.posts[i].posterID;
      data.posts[i].posterUsername = message.subscribers[posterID].name;
      data.posts[i].poster = message.subscribers[posterID].realname;
    }
    callback(data);
  });
}

messageSchema.statics.findUserMessages = function(userID, callback) {
  this.find({ subscribers: userID }).populate('subscribers').sort('-lastPostAt').exec(function(err, messages) {
    var messageInfo = {};
    for (var i = 0; i < messages.length; i++) {
      messageInfo[i] = {};
      messageInfo[i].id = messages[i].id;
      
      var memberNames = [];
      for (var x = 0; x < messages[i].subscribers.length; x++)
        memberNames.push(messages[i].subscribers[x].realname);
        
      var numNames = memberNames.length;
      messageInfo[i].members = "Conversation between ";
      if (numNames === 1)
        messageInfo[i].members = 'Yourself';
      else if (numNames === 2)
        messageInfo[i].members += memberNames[0] + " and " + memberNames[1];
      else {
        for (var x = 0; x < numNames - 1; x++)
          messageInfo[i].members += memberNames[x] + ", ";
        messageInfo[i].members += "and " + memberNames[numNames - 1];
      }
      
      var lastPost = messages[i].lastPost;
      if (lastPost) {
        console.log(lastPost);
        messageInfo[i].lastPoster = messages[i].subscribers[lastPost.posterID].realname;
        messageInfo[i].lastPostText = lastPost.postText;
      }
      else {
        messageInfo[i].lastPoster = 'Nobody yet';
        messageInfo[i].lastPostText = 'Nothing posted';
      }
    }
    callback(messageInfo);
  });
}

messageSchema.statics.getUser = function(messageID, userID, callback) {
  this.findOne({ id: messageID }).populate('subscribers').exec(function(err, message) {
    callback(message.subscribers[userID]);
  });
}

var eventSchema = new Schema({
  ownerID: {type: ObjectId, ref: 'User'},
  timeOf: Date,
  location: String,
  title: String,
  maxRegistrants: Number,
  registrantID: [{type: ObjectId, ref: 'User'}]
}, { collection: 'events' });

// MODELS
exports.User = User;
exports.Message =  mongoose.model('Message', messageSchema);
exports.Event = mongoose.model('Event', eventSchema);
exports.conf = conf;