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
    db.selectMakers(function (err, makers) {
        if (err) { callback(err); return; }
        res.status(202).json(makers);
    })
}

function getModels (req, res) {
    var data = {maker: req.body.maker}
    db.selectModels(data, function (err, models) {
        if (err) { callback(err); return; }
        res.status(202).json(models)
    })
}

function getOS (req, res) {
    var data = {maker: req.body.maker, model: req.body.model}
    db.selectOS(data, function (err, os) {
        if (err) { callback(err); return; }
        res.status(202).json(os)
    })
}
