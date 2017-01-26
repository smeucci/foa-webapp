// ========
// query.js
// ========

// require
var path = require('path');
var random = require(path.join(__dirname, '../utils/random'))
var upload = require(path.join(__dirname, '../utils/upload')).upload;

// fucntions
var run = async function (req, res) {
    var folder = random.generate(32);
    var success = await upload(req, folder)
    res.json({success: success, folder: folder})
}

// exports
module.exports = {
    run
}
