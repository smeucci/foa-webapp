// ========
// db.js
// ========

// require
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(__dirname + '/sqlite/database.db');

// functions
function selectMakers () {
    var makers = [];
    var query = "SELECT DISTINCT maker FROM DeviceModel";
    return new Promise (function (resolve, reject) {
        db.all(query, function (err, res) {
            if (err) { callback(err); return; }
            res.forEach(function (item, i) { makers.push({ value: item.maker, text: item.maker }) });
            return resolve(makers);
        });
    })
}

function selectModels (data) {
    var models = [];
    var query = "SELECT model FROM DeviceModel WHERE maker = '" + data.maker + "'";
    return new Promise (function (resolve, reject) {
        db.all(query, function (err, res) {
            if (err) { callback(err); return; }
            res.forEach(function (item, i) { models.push({ value: item.model, text: item.model }) });
            return resolve(models);
        });
    })
}

function selectOS (data) {
    var os = [];
    var query = "SELECT * FROM OperatingSystem WHERE id IN "
                + "(SELECT operating_system FROM VideoFile WHERE device_model = "
                + "(SELECT id FROM DeviceModel "
                + "WHERE maker = '" + data.maker + "' AND model = '" + data.model + "'))";
    return new Promise (function (resolve, reject) {
        db.all(query, function (err, res) {
            if (err) { callback(err); return; }
            res.forEach(function (item, i) {
                os.push({ value: item.name + "-" + item.version, text: item.name + " " + item.version });
            });
            return resolve(os);
        });
    })
}

// exports
module.exports = {
    selectMakers,
    selectModels,
    selectOS
};
