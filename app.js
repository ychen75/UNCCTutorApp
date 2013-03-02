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
var app = express();
var conf = db.conf;

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
    cookie: { maxAge: 60000 } // Expires after 1 minute
  }));
  app.use(app.router);
  app.use(require('stylus').middleware(__dirname + '/public'));
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

/******************
 *     ROUTES     *
 ******************/
app.get('/', routes.index);
app.get('/login', routes.login);

/********************
 *      POSTS       *
 ********************/
app.post('/login', postActions.login);
app.post('/logout', postActions.logout);

/**********************
 *    FINAL SETUP     *
 **********************/
http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});