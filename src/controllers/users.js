var express = require("express");
var router = express.Router();
var path = require("path");
var User = require("../models/User");
var database = require('../app').database;
var jwt = require('express-jwt');

var auth = jwt({
    secret: process.env.TOKEN_SECRET,
    userProperty: 'payload'
});

router.get('/', auth, function(req, res) {
    var params = {
        TableName : process.env.USERS_TABLE,
    };

    database.scan(params, function(err, data) {
        if (err) { 
            console.log(err);
            res.status(500).end();
        } else {
            var users = [];

            data.Items.forEach(element => {
                users.push(User.summarize(element));
            });

            res.status(200).json({
                'users': users
            });
        }
    })
});

module.exports = router;