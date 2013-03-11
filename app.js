/***********************
 *       MODULES       *
 ***********************/
var express = require('express')
  , routes = require('./routes')
  , postActions = require('./routes/postActions')
  , http = require('http')
  , path = require('path')
  , db = require('./db')
  , MongoStore = require('connect-mongo')(express);
  
/***********************
 *    CONFIGURATION    *
 ***********************/
var app = express();  // Create express server
var conf = db.conf; // Import database configuration

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session({
    secret: conf.secret,
    store: new MongoStore(conf.db),
    cookie: { maxAge: 3600000 } // Expires after 1 hour
  }));
  app.use(app.router);
  app.use(require('stylus').middleware(__dirname + '/public'));
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

/**********************
 *    Create Server     *
 **********************/
var server = http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

/******************
 *     ROUTES     *
 ******************/
app.get('/login', routes.login);
app.get('/messages', routes.messages);
app.get('/messages/:id', routes.message);
app.get('/register', routes.register);
app.get('/test', routes.test);
app.get('/:user', routes.user);
app.get('/', routes.index);

/********************
 *      POSTS       *
 ********************/
app.post('/login', postActions.login);
app.post('/logout', postActions.logout);
app.post('/register', postActions.register);
app.post('/newMessage', postActions.newMessage);
app.post('/test', postActions.test);

/********************
 *    Socket.io     *
 ********************/
exports.io = require('socket.io').listen(server, { log: false });
var socketFunctions = require('./routes/socketFunctions');