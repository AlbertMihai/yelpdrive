const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');

let romaneasca = '';

router.get('/register', (req, res) => {
    res.render('users/register');
})
router.post('/register', async (req, res, next) => {
    try {
        const {email, username, password} = req.body;
        const user = new User({email, username});
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, (err) => {
            if (err) return next(err);
            req.flash('success', 'Welcome to Yelp Drive!');
            res.redirect('/schools');
        })
    } catch(e){
        req.flash('error', e.message);
        res.redirect('/register')
    }
})

router.get('/login', (req, res) => {
    romaneasca = req.session.returnTo;
    delete req.session.returnTo;
    res.render('users/login');
})

router.post('/login', passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}) ,(req, res) => {
    req.flash('success', 'Welcome Back!');
    const redirectUrl = romaneasca || '/schools';
    res.redirect(redirectUrl);
})

router.get('/logout', (req, res, next) => {
    req.logOut((err) => {
        if (err) return next(err);
        req.flash('success', 'GoodBye!');
        res.redirect('/schools');
    });
})

module.exports = router;