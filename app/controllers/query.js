// ========
// query.js
// ========

// require
var path = require('path');
var upload = require(path.join(__dirname, '../utils/upload')).upload;

// fucntions
var run = async function (req, res) {
    var success = await upload(req)
    res.send(success)
}

// exports
module.exports = {
    run
}
