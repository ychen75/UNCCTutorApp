
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , mongoose = require('mongoose');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
  app.use(app.router);
  app.use(require('stylus').middleware(__dirname + '/public'));
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

// Connect to mongodb databases stored on the localhost and use the database named 'test'
mongoose.connect('localhost','test');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', function callback() {
  // Anything that needs to be run each time the server is started
  console.log('Database connection: OK');
});

// SCHEMAS
var ObjectId = mongoose.Schema.Types.ObjectId;

var userSchema = new mongoose.Schema({
  name: String,
  isTutor: Boolean,
  messages: [ObjectId],
  schedule: [ObjectId]
});
var messageSchema = new mongoose.Schema({
  subscribers: [Number],
  posts: [{
    posterId: ObjectId,
    postText: String,
    timePosted: Date
  }],
});
var eventSchema = new mongoose.Schema({
  ownerID: ObjectId,
  timeOf: Date,
  location: String,
  title: String,
  maxRegistrants: Number,
  registrantID: [Number]
});

// MODELS
var User = mongoose.model('User', userSchema);
var Message = mongoose.model('Message', messageSchema);
var Event = mongoose.model('Event', eventSchema);

// ROUTES
// Index
app.get('/', function(req, res) {
  res.render('index', {
    title: 'UNCC Tutor Tracker'
  });
});
app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});