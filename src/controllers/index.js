var path = require('path');
var express = require("express");
var router = express.Router();

router.use('/register', require('./register'));
router.use('/login', require('./login'));
router.use('/profile', require('./profile'));

router.get('/', function(req, res) {
    /* get paginated results here */
    res.sendFile(path.resolve(__dirname + '/../views/index.html'));
});


module.exports = router;