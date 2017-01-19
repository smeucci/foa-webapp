var express = require('express');
var app = express();
var path = require("path");
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(path.join(__dirname+'/public/db/database.db'));
var bodyParser = require('body-parser');
var unique = require('array-unique');

app.use(bodyParser.urlencoded({extended: true}));

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname+'/views/index.html'))
});

app.get('/makers', function(req, res) {
    var gets = []
    db.all("SELECT maker FROM DeviceModel", function(e,r) {
        r.forEach(function (item, i) { gets.push(item.maker) })
        res.status(202).json(unique(gets));
    });
});

app.post('/models', function(req, res) {
    var maker = req.body.maker
    var query = "SELECT model FROM DeviceModel WHERE maker = '" + maker + "'"
    var models = []
    db.all(query, function(e,r) {
        res.status(202).json(r);
    });
});

app.post('/os', function(req, res) {
    var maker = req.body.maker
    var model = req.body.model
    var query = "SELECT * FROM OperatingSystem WHERE id IN "
                + "(SELECT operating_system FROM VideoFile WHERE device_model = "
                + "(SELECT id FROM DeviceModel WHERE maker = '" + maker + "' AND model = '" + model + "'))"
    db.all(query, function(e,r) {
	    res.status(202).json(r);
    });
});

app.listen(3000, function () {
    console.log('Listening on port 3000...');
});
