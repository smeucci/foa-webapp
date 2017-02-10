// ========
// sqlite.js
// ========

// require
var path = require('path');
var fs = require('fs-extra');
var java = require(path.join(__dirname, '/../utils/java'));

// functions
async function initDB (req, res) {
    var success = await java.init();
    console.log('db init done.');
    res.json();
}

async function updateDB (req, res) {
    var exitCode = await java.update();
    console.log('db update done.');
    res.json();
}

// exports
module.exports = {
    initDB,
    updateDB
}
