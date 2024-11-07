const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/User');

// Home route
router.get('/', (req, res) => {
    res.redirect('/posts');
});

// Register page
router.get('/register', (req, res) => {
    res.render('auth/register');
});

// Register handle
router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check if user already exists
        let user = await User.findOne({ username });
        if (user) {
            req.flash('error_msg', 'Username is already registered');
            return res.redirect('/register');
        }

        // Create new user
        user = new User({
            username,
            password
        });

        await user.save();
        req.flash('success_msg', 'You are now registered and can log in');
        res.redirect('/login');
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Registration error');
        res.redirect('/register');
    }
});

// Login page
router.get('/login', (req, res) => {
    res.render('auth/login');
});

// Login handle
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/posts',
        failureRedirect: '/login',
        failureFlash: true
    })(req, res, next);
});

// Logout handle
router.get('/logout', (req, res) => {
    req.logout(function(err) {
        if (err) {
            console.error(err);
            return next(err);
        }
        req.flash('success_msg', 'You are logged out');
        res.redirect('/login');
    });
});

module.exports = router;
