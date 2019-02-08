var fs = require('fs');
const routes = require('express').Router();

routes.get('/', function(req, res) {
    fs.readFile(__dirname + '/../views/index/index.html', function(err, data) { 
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        res.end()
    });
});

module.exports = routes;