'use strict';

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);

const app = express();
const PORT = process.env.PORT || 3000;
const SESSION_SECRET = process.env.SESSION_SECRET || 'supersecret';

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// express-session middleware
app.use(session({
  store: new RedisStore(),
  secret: SESSION_SECRET
}));
// create own middleware
app.use((req, res, next) => {
  req.session.visits = req.session.visits || {};
  req.session.visits[req.url] = req.session.visits[req.url] || 0;
  req.session.visits[req.url]++;

  console.log(req.session);
  next();
});

// set public folder
app.use(express.static(path.join(__dirname, 'public')));

// routes
app.get('/', (req, res) => {
  res.render('index');
});
// login form
app.get('/login', (req, res) => {
  res.render('login');
});
// submit login
app.post('/login', (req, res) => {
  res.redirect('/');
});
// register form
app.get('/register', (req, res) => {
  res.render('register');
});
// submit register
app.post('/register', (req, res) => {

  if (req.body.password === req.body.verify) {
    res.redirect('/login');
  } else {
    res.render('register', {
      email: req.body.email,
      message: 'Passwords do not match'
    });
  }

});

// server listen
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

