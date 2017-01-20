// ========
// db.js
// ========
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(__dirname + '/sqlite/database.db');

module.exports = {
    getMakers,
    getModels,
    getOS
};

function getMakers (callback) {
    var makers = []
    var query = "SELECT DISTINCT maker FROM DeviceModel"
    db.all(query, function (e, r) {
        if (e) { callback(e); return; }
        r.forEach(function (item, i) { makers.push({value: item.maker, text: item.maker}) })
        callback(null, makers);
    });
}

function getModels (req, callback) {
    var maker = req.body.maker
    var models = []
    var query = "SELECT model FROM DeviceModel WHERE maker = '" + maker + "'"
    db.all(query, function (e, r) {
        if (e) { callback(e); return; }
        r.forEach(function (item, i) { models.push({value: item.model, text: item.model}) })
        callback(null, models);
    });
}

function getOS (req, callback) {
    var maker = req.body.maker
    var model = req.body.model
    var os = []
    var query = "SELECT * FROM OperatingSystem WHERE id IN "
                + "(SELECT operating_system FROM VideoFile WHERE device_model = "
                + "(SELECT id FROM DeviceModel WHERE maker = '" + maker + "' AND model = '" + model + "'))"
    db.all(query, function (e, r) {
        if (e) { callback(e); return; }
        r.forEach(function (item, i) {
            os.push({value: item.name + "-" + item.version, text: item.name + " " + item.version})
        })
        callback(null, os)
    });
}
