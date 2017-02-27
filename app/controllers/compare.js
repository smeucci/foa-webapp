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
    res.json();
}

// exports
module.exports = {
    compare
}
