var express = require("express");
var router = express.Router();

var database = require("../app").database;

router.get('/', function(req, res) {
    /* Get paginated posting data, maybe 50 at a time? */
});

module.exports = router;