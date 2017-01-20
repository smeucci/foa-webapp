// ========
// db.js
// ========
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(__dirname + '/sqlite/database.db');

module.exports = {
    selectMakers,
    selectModels,
    selectOS
};

function selectMakers (callback) {
    var makers = []
    var query = "SELECT DISTINCT maker FROM DeviceModel"
    db.all(query, function (e, r) {
        if (e) { callback(e); return; }
        r.forEach(function (item, i) { makers.push({value: item.maker, text: item.maker}) })
        callback(null, makers);
    });
}

function selectModels (data, callback) {
    var models = []
    var query = "SELECT model FROM DeviceModel WHERE maker = '" + data.maker + "'"
    db.all(query, function (e, r) {
        if (e) { callback(e); return; }
        r.forEach(function (item, i) { models.push({value: item.model, text: item.model}) })
        callback(null, models);
    });
}

function selectOS (data, callback) {
    var os = []
    var query = "SELECT * FROM OperatingSystem WHERE id IN "
                + "(SELECT operating_system FROM VideoFile WHERE device_model = "
                + "(SELECT id FROM DeviceModel "
                + "WHERE maker = '" + data.maker + "' AND model = '" + data.model + "'))"
    db.all(query, function (e, r) {
        if (e) { callback(e); return; }
        r.forEach(function (item, i) {
            os.push({value: item.name + "-" + item.version, text: item.name + " " + item.version})
        })
        callback(null, os)
    });
}
