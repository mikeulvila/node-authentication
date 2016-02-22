'use strict';

const express = require('express');
const router = express.Router();

// model
const User = require('./model');

// login form
router.get('/login', (req, res) => {
  res.render('login');
});

// submit login
router.post('/login', (req, res) => {
  User.findOne({email: req.body.email}, (err, user) => {
    if (err) throw err;

    if (user) {
      user.authenticate(req.body.password, (err, valid) => {
        if (err) throw err;

        if (valid) {
          req.session.user = user;
          res.redirect('/');
        } else {
          res.redirect('/login');
        }
      })
    } else {
      res.redirect('/login');
    }
  });
});

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

module.exports = router;
