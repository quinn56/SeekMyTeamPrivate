var path = require('path');
var express = require("express");
var router = express.Router();

router.use('/register', require('./register'));
router.use('/login', require('./login'));

router.get('/', function(req, res) {
    res.sendFile(path.resolve(__dirname + '/../index.html'));
});


module.exports = router;