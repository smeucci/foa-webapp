// ==========
// dropdown.js
// ==========

// require
var db = require(__dirname + '/../models/db.js');

// functions
var getMakers = async function(req, res) {
    var makers = await db.selectMakers();
    res.status(202).json(makers);
}

var getModels = async function (req, res) {
    var data = { maker: req.body.maker };
    var models = await db.selectModels(data);
    res.status(202).json(models);
}

var getOS = async function (req, res) {
    var data = { maker: req.body.maker, model: req.body.model };
    var os = await db.selectOS(data);
    res.status(202).json(os);
}

// exports
module.exports = {
    getMakers,
    getModels,
    getOS
};
