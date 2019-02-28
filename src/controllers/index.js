var path = require('path');
var express = require("express");
var jwt = require('express-jwt');
var auth = jwt({
    secret: process.env.TOKEN_SECRET,
    userProperty: 'payload'
});

var router = express.Router();

var database = require('../app').database;

router.use('/register', require('./register'));
router.use('/login', require('./login'));
router.use('/profile', auth, require('./profile'));

router.get('/posts', auth, function(req, res) {
    res.send('get paginated results here');
});

router.get('/filter', auth, function(req, res) {
    res.send('get filtered results here');
});


module.exports = router;