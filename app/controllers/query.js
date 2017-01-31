// ========
// query.js
// ========

// require
var path = require('path');
var fs = require('fs-extra');
var random = require(path.join(__dirname, '/../utils/random'))
var upload = require(path.join(__dirname, '/../utils/upload'));
var java = require(path.join(__dirname, '/../utils/java'));
var db = require(path.join(__dirname, '/../models/db'));
var utils = require(path.join(__dirname, '/../utils/utils'));

// functions
var run = async function (req, res) {
    // generate random folder for this session
    var folder = random.generate(32);
    // upload files
    var results = await upload.upload(req, folder);
    var _class = results.class;
    // query for class A and B
    var videosA = await db.selectClassA(_class)
    var videosB = await db.selectClassB(_class)
    var listA = {list: videosA};
    var listB = {list: videosB};
    var jsonA = JSON.stringify(listA);
    var jsonB = JSON.stringify(listB);
    // save list of files for class A and B
    fs.writeFileSync(path.join(upload.uploadsDir(), folder, '/listA.json'), jsonA, 'utf8', function () {});
    fs.writeFileSync(path.join(upload.uploadsDir(), folder, '/listB.json'), jsonB, 'utf8', function () {});
    // train
    var exitCodeTrain = await java.train(folder);
    // parse
    var exitCodeParse = await java.parse(folder);
    // test
    var likelihoods = {results: []};
    for (var i = 0; i < results.filenames.length; i++) {
        var likelihood = await java.test(folder, results.filenames[i]);
        likelihood.filename = path.basename(likelihood.filename);
        likelihoods.results.push(likelihood);
    }
    console.log(JSON.stringify(likelihoods));
    // return
    res.json({success: results.success, folder: folder, result: likelihoods});
}

// exports
module.exports = {
    run
}
