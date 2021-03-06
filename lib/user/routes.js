'use strict';

const express = require('express');
const router = express.Router();
const passport = require('passport');

// model
const User = require('./model');

require('./local.js');

// login form
router.get('/login', (req, res) => {
  res.render('login');
});

// submit login
router.post('/login',
  passport.authenticate('local',
    {
      failureFlash: 'Incorrect email or password',
      failureRedirect: '/login',
      successFlash: 'Success!',
      successRedirect: '/'
    }
  )
);

// register form
router.get('/register', (req, res) => {
  res.render('register');
});

// submit register
router.post('/register', (req, res) => {
  if (req.body.password === req.body.verify) {
    User.findOne({email: req.body.email}, (err, user) => {
      if (err) throw err;

      if (user) {
        res.redirect('/login');
      } else {
        User.create(req.body, (err, user) => {
          res.redirect('/login');
        });
      }
    });
  } else {
    res.render('register', {
      email: req.body.email,
      message: 'Passwords do not match'
    });
  }
});

// DELETE
router.delete('/login', (req, res) => {
  req.session.regenerate(function(err) {
    if (err) throw err;

    res.redirect('/');
  });
});





module.exports = router;
