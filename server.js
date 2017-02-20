// =========
// server.js
// =========

// require
var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var unique = require('array-unique');
var dropdown = require(path.join(__dirname, '/app/controllers/dropdown'));
var query = require(path.join(__dirname, '/app/controllers/query'));
var sqlite = require(path.join(__dirname, '/app/controllers/sqlite'));
var train = require(path.join(__dirname, '/app/controllers/train'));
var port = process.env.PORT || 3000;

// settings
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, '/public')));

// functions
app.get('/', function (req, res) {
    console.log(req.ip)
    res.sendFile(path.join(__dirname, '/app/views/index.html'));
});

app.get('/test', function (req, res) {
    res.sendFile(path.join(__dirname, '/app/views/test.html'));
});

app.get('/compare', function (req, res) {
    res.sendFile(path.join(__dirname, '/app/views/compare.html'));
});

app.get('/brands', dropdown.getBrands);
app.get('/models', dropdown.getModels);
app.get('/os', dropdown.getOS);
app.post('/query', query.query);
app.get('/querytest', query.querytest);
app.get('/download', function (req, res){
  res.download(path.join(__dirname, '/app/jar/vft-parse.jar'), 'vft-parse.jar');
});
app.get('/init', sqlite.initDB);
app.get('/update', sqlite.updateDB);
app.get('/train', train.train);

app.listen(port, function () {
    console.log('Listening on port ' + port + '...');
});

// exports
module.exports = app;
