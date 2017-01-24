// ==========
// dropdown.js
// ==========

// require
var db = require(__dirname + '/../models/db');

// functions
var getBrands = async function(req, res) {
    var brands = await db.selectBrands();
    res.json(brands);
}

var getModels = async function (req, res) {
    var data = { brand: req.query.brand };
    var models = await db.selectModels(data);
    res.json(models);
}

var getOS = async function (req, res) {
    var data = { brand: req.query.brand, model: req.query.model };
    var os = await db.selectOS(data);
    res.json(os);
}

// exports
module.exports = {
    getBrands,
    getModels,
    getOS
};
