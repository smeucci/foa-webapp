// ==========
// dropdown.js
// ==========

var db = require(__dirname + '/../models/db.js');

module.exports = {
    getMakers,
    getModels,
    getOS
}

function getMakers (req, res) {
    db.getMakers(function (err, makers) {
        if (err) { callback(err); return; }
        res.status(202).json(makers);
    })
}

function getModels (req, res) {
    db.getModels(req, function (err, models) {
        if (err) { callback(err); return; }
        res.status(202).json(models)
    })
}

function getOS (req, res) {
    db.getOS(req, function (err, os) {
        if (err) { callback(err); return; }
        res.status(202).json(os)
    })
}
