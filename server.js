'use strict';

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);

// routes
const userRoutes = require('./lib/user/routes');

const app = express();
const PORT = process.env.PORT || 3000;
const SESSION_SECRET = process.env.SESSION_SECRET || 'supersecret';

const mongoose = require('mongoose');

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
// set local user
app.use((req, res, next) => {
  app.locals.user = req.session.user || { email: 'Guest' };
  next();
});

// set public folder
app.use(express.static(path.join(__dirname, 'public')));

// index route
app.get('/', (req, res) => {
  res.render('index');
});

// use routes
app.use(userRoutes);

// Mongoose create the database connection
mongoose.connect('mongodb://localhost/node-authentication', (err) => {
  if (err) throw err;

  // server listen
  app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
  });

});





