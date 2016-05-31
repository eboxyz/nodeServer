var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bcrypt = require('bcrypt-nodejs');
var ejs = require('ejs');
var path = require('path');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;


//link to our routes
var route = require('./route');

//link to our model
var Model = require('./model');

//instantialize express in our app
var app = express();

//setup localAuth through passport+passport-local
passport.use(new LocalStrategy(function(username, password, done){
	new Model.User({username: username}).fetch().then(function(data){
		var user = data;
		if(user === null){
			return done(null, false, {message: 'Invalid username or password'});
		} else{
			user = data.toJSON();
			if(!bcrypt.compareSync(password, user.password)){
				return done(null, false, {message: 'Invalid username or password'});
			} else{
				return done(null, user);
			}
		}
	});
}));

passport.serializeUser(function(user, done){
	done(null, user.username)
});

passport.deserializeUser(function(username, done){
	new Model.User({username: username}).fetch().then(function(user){
		done(null, user);
	});
});

//set what port the server is served on
app.set('port', process.env.PORT || 8080);

//set where our views directory is -- shoutout to drake
app.set('views', path.join(__dirname, 'views'));

//set what our view engine is going to be
app.set('view engine', 'ejs')''


//middlewares our app is using
//cookie+bodyparser to get info from input
//initialize sessions
app.use(cookieParser());
app.use(bodyParser());
app.use(session({secret: 'secret code'}));
app.use(passport.initialize());
app.use(passport.session());


//routing our app and telling it what function to use on each route
app.get('/', route.index);

app.get('/signin', route.signIn);

app.post('signin', route.signInPost);

app.get('/signup', route.signUp);

app.post('/signup', route.signUpPost);

app.get('/signout', route.signOut);


var server = app.listen(app.get('port'), function(err) {
   if(err) throw err;

   var message = 'Server is running @ http://localhost:' + server.address().port;
   console.log(message);
});




















