// ========
// sqlite.js
// ========

// require
var path = require('path');
var fs = require('fs-extra');
var java = require(path.join(__dirname, '/../utils/java'));
var db = require(path.join(__dirname, '/../models/db'));

// functions
async function initDB (req, res) {
    var success = await java.init();
    console.log('db init done.');
    res.json('db init done.');
}

async function updateDB (req, res) {
    var exitCode = await java.updateTraining();
    var exitCode = await java.updateTesting();
    console.log('db update done.');
    res.json('db update done.');
}

async function divideDB (req, res) {
    var ids = await db.selectBrandModelIDs();
    for (var i = 0; i < ids.length; i++) {
        var videos = await db.selectVideosByBrandModelID(ids[i].id);
        videos.forEach(function (v) {
            vtest = {}
            vtest.pathtofile = v.pathtofile.replace("training", "testing");
            vtest.pathtoxml = v.pathtoxml.replace("training", "testing");
            vtest.pathtoinfo = v.pathtoinfo.replace("training", "testing");
            fs.move(v.pathtofile, vtest.pathtofile, { overwrite: true }, function (err) {});
            fs.move(v.pathtoxml, vtest.pathtoxml, { overwrite: true }, function (err) {});
            fs.move(v.pathtoinfo, vtest.pathtoinfo, { overwrite: true }, function (err) {});
        })
    }
    res.json('db divided.');
}

// exports
module.exports = {
    initDB,
    updateDB,
    divideDB
}
