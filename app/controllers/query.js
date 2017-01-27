// ========
// query.js
// ========

// require
var path = require('path');
var random = require(path.join(__dirname, '../utils/random'))
var upload = require(path.join(__dirname, '../utils/upload'));

// fucntions
var run = async function (req, res) {
    var folder = random.generate(32);
    var results = await upload.upload(req, folder);
    var class_A = results.class;
    res.json({success: results.success, folder: folder});
}

// exports
module.exports = {
    run
}
