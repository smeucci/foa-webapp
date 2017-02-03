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
    if (classIsAllAny(_class)) {
        console.log('auto');
        var likelihoods = await query_automatic(folder, results);
    } else {
        console.log('manual');
        var likelihoods = await query_manual(_class, folder, results);
    }
    // return
    res.json({success: results.success, folder: folder, results: likelihoods});
}

async function query_manual (_class, folder, results) {
    // query for class A and B
    var videosA = await db.selectClassA(_class);
    var videosB = await db.selectClassB(_class);
    var jsonA = JSON.stringify({list: videosA});
    var jsonB = JSON.stringify({list: videosB});
    // save list of files for class A and B
    fs.writeFileSync(path.join(upload.uploadsDir(), folder, '/listA.json'), jsonA, 'utf8', function () {});
    fs.writeFileSync(path.join(upload.uploadsDir(), folder, '/listB.json'), jsonB, 'utf8', function () {});
    console.log(JSON.stringify(_class));
    console.log('A: ' + videosA.length);
    console.log('B: ' + videosB.length);
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
    console.log(likelihoods);
    return likelihoods;
}

async function query_automatic () {
    return {results: [{filename: '', likelihood: '', loglikelihood: ''}]};
}

function classIsAllAny (_class) {
    if (_class.brand === 'Any' && _class.model === 'Any' && _class.os === 'Any') {
        return true;
    } else {
        return false;
    }
}

// exports
module.exports = {
    run
}
