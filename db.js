var mongoose = require('mongoose');
var conf = {
  db: {
    db: 'mydb',
    host: 'localhost',
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
  messages: [ObjectId],
  schedule: [ObjectId]
}, { collection: 'users' });
var messageSchema = new Schema({
  subscribers: [Number],
  posts: [{
    posterId: ObjectId,
    postText: String,
    timePosted: Date
  }],
}, { collection: 'messages' });
var eventSchema = new Schema({
  ownerID: ObjectId,
  timeOf: Date,
  location: String,
  title: String,
  maxRegistrants: Number,
  registrantID: [Number]
}, { collection: 'events' });

// MODELS
exports.User = mongoose.model('User', userSchema);
exports.Message = mongoose.model('Message', messageSchema);
exports.Event = mongoose.model('Event', eventSchema);
exports.conf = conf;