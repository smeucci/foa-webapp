// ========
// query.js
// ========

// require
var path = require('path');
var fs = require('fs-extra');
var random = require(path.join(__dirname, '/../utils/random'))
var upload = require(path.join(__dirname, '/../utils/upload'));
var db = require(path.join(__dirname, '/../models/db'));

// fucntions
var run = async function (req, res) {
    var folder = random.generate(32);
    var results = await upload.upload(req, folder);
    var class_A = results.class;
    var videos = await db.selectClassA(class_A)
    var listA = {list: videos}
    var json = JSON.stringify(listA);
    fs.writeFileSync(path.join(__dirname, '/../uploads/', folder, '/listA.json'), json, 'utf8', function () {});
    res.json({success: results.success, folder: folder});
}

// exports
module.exports = {
    run
}
