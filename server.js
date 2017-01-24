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
var upload = require(path.join(__dirname, '/app/controllers/upload'));
var port = process.env.PORT || 3000;

// settings
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, '/public')));

// functions
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '/app/views/index.html'))
});

app.get('/brands', dropdown.getBrands);
app.get('/models', dropdown.getModels);
app.get('/os', dropdown.getOS);
app.post('/upload', upload.upload);

app.listen(port, function () {
    console.log('Listening on port ' + port + '...');
});

// exports
module.exports = app;
