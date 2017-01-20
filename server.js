// npm modules
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var unique = require('array-unique');
var port = process.env.PORT || 3000

// internal modules
var dropdown = require(__dirname + '/app/controllers/dropdown.js');

// settings
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));

// functions
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/app/views/index.html')
});

app.get('/makers', dropdown.getMakers);

app.post('/models', dropdown.getModels);

app.post('/os', dropdown.getOS);

app.listen(port, function () {
    console.log('Listening on port ' + port + '...');
});
