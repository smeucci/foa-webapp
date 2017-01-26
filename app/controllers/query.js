// ========
// query.js
// ========

// require
var path = require('path');
var random = require(path.join(__dirname, '../utils/random'))
var upload = require(path.join(__dirname, '../utils/upload')).upload;

// fucntions
var run = async function (req, res) {
    var rndm = random.generate(32);
    var success = await upload(req, rndm)
    res.json({success: success, random: rndm})
}

// exports
module.exports = {
    run
}
