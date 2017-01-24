// ========
// db.js
// ========

// require
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(__dirname + '/sqlite/database.db');

// functions
function selectBrands () {
    var query = "SELECT DISTINCT brand FROM DeviceModel";
    return new Promise (function (resolve, reject) {
        db.all(query, function (err, res) {
            if (err) { callback(err); return; }
            var brands = res.map(r => ({value: r.brand, text: r.brand}))
            return resolve(brands);
        });
    })
}

function selectModels (data) {
    var query = "SELECT model FROM DeviceModel WHERE brand = '" + data.brand + "'";
    return new Promise (function (resolve, reject) {
        db.all(query, function (err, res) {
            if (err) { callback(err); return; }
            var models = res.map(r => ({value: r.model, text: r.model}))
            return resolve(models);
        });
    })
}

function selectOS (data) {
    var query = "SELECT * FROM OperatingSystem WHERE id IN "
                + "(SELECT operating_system FROM VideoFile WHERE device_model = "
                + "(SELECT id FROM DeviceModel "
                + "WHERE brand = '" + data.brand + "' AND model = '" + data.model + "'))";
    return new Promise (function (resolve, reject) {
        db.all(query, function (err, res) {
            if (err) { callback(err); return; }
            var os = res.map(r => ({ value: r.name + "-" + r.version, text: r.name + " " + r.version }))
            return resolve(os);
        });
    })
}

// exports
module.exports = {
    selectBrands,
    selectModels,
    selectOS
};
