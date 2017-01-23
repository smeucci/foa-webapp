// ==========
// dropdown.js
// ==========

// require
var db = require(__dirname + '/../models/db.js');

// functions
async function getMakers (req, res) {
    var makers = await db.selectMakers();
    res.status(202).json(makers);
}

async function getModels (req, res) {
    var data = { maker: req.body.maker };
    var models = await db.selectModels(data);
    res.status(202).json(models);
}

async function getOS (req, res) {
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
