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
    // parse
    var exitCodeParse = await java.parse(folder);
    // compute likelihoods
    if (classIsAllAny(results.class)) {
        console.log('auto');
        var likelihoods = await query_automatic(folder, results);
    } else {
        console.log('manual');
        var likelihoods = await query_manual(folder, results);
    }
    // return
    res.json({success: results.success, folder: folder, results: likelihoods});
}

async function query_manual (folder, results) {
    // query for class A and B
    var videosA = await db.selectClassA(results.class);
    var videosB = await db.selectClassB(results.class);
    var jsonA = JSON.stringify({list: videosA});
    var jsonB = JSON.stringify({list: videosB});
    // save list of files for class A and B
    fs.writeFileSync(path.join(upload.uploadsDir(), folder, '/listA.json'), jsonA, 'utf8', function () {});
    fs.writeFileSync(path.join(upload.uploadsDir(), folder, '/listB.json'), jsonB, 'utf8', function () {});
    // train
    var exitCodeTrain = await java.train(folder);
    // test
    var likelihoods = {results: []};
    for (var i = 0; i < results.filenames.length; i++) {
        var likelihood = await java.test(folder, results.filenames[i]);
        likelihood.filename = path.basename(likelihood.filename);
        likelihood.class = results.class;
        likelihoods.results.push(likelihood);
    }
    return likelihoods;
}

async function query_automatic (folder, results) {
    var data = []
    var brands = await db.selectBrands();
    for (var i = 0; i < brands.length; i++) {
        var models = await db.selectModels({brand: brands[i].value});
        for (var j = 0; j < models.length; j++) {
            var os = await db.selectOS({brand: brands[i].value, model: models[j].value});
            for (var h = 0; h < os.length; h++) {
                console.log({brand: brands[i].value, model: models[j].value, os: os[h].value});
                results.class = {brand: brands[i].value, model: models[j].value, os: os[h].value};
                var res = await query_manual(folder, results);
                data.push(res);
            }
        }
    }
    var likelihoods = utils.maxLikelihood(data, results.filenames.length);
    return likelihoods;
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
