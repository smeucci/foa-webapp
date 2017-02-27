// ========
// compare.js
// ========

// require
var path = require('path');
var fs = require('fs-extra');
var upload = require(path.join(__dirname, '/../utils/upload'));
var java = require(path.join(__dirname, '/../utils/java'));
var db = require(path.join(__dirname, '/../models/db'));
var utils = require(path.join(__dirname, '/../utils/utils'));
var config = utils.parseConfig(path.join(__dirname, '/../config/config.conf'));

// functions
async function compare (req, res) {
    // generate random folder for this session
    var folder = utils.random(32);
    // upload files
    var setup = await upload.upload(req, folder);
    // parse
    var exitCodeParse = await java.parse(folder);
    // compare
    var result1 = await java.compare(setup.class.ref, setup.class.query, folder);
    var result2 = await java.compare(setup.class.query, setup.class.ref, folder);
    // return
    result1.reference = path.basename(result1.reference);
    result1.query = path.basename(result1.query);
    result2.reference = path.basename(result2.reference);
    result2.query = path.basename(result2.query);
    var result = {rq: result1, qr: result2};
    res.json(result);
}

// exports
module.exports = {
    compare
}
