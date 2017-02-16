// ========
// query.js
// ========

// require
var path = require('path');
var fs = require('fs-extra');
var upload = require(path.join(__dirname, '/../utils/upload'));
var java = require(path.join(__dirname, '/../utils/java'));
var db = require(path.join(__dirname, '/../models/db'));
var utils = require(path.join(__dirname, '/../utils/utils'));

// functions
var query = async function (req, res) {
    // generate random folder for this session
    var folder = utils.random(32);
    // upload files
    var setup = await upload.upload(req, folder);
    // parse
    var exitCodeParse = await java.parse(folder);
    // compute likelihoods
    var results = await run(folder, setup);
    // return
    res.json({success: setup.success, folder: folder, results: results});
}

var querytest = async function (req, res) {
    // generate random folder for this session
    var folder = utils.random(32);
    // parse req and mkdir folder
    var setup = await utils.setupTest(req, folder);
    // get test filenames from db
    setup.filenames = await db.selectTestFiles(5);
    // compute likelihoods
    var results = await run(folder, setup);
    // compute stats
    var stats = utils.computeStats(results);
    // return
    res.json({success: setup.success, folder: folder, results: results, stats: stats});
}

async function run (folder, setup) {
    // setup likelihoods data structure
    var likelihoods = setup_likehoods(setup.filenames);
    // compute likelihoods
    if (classIsAllAny(setup.class)) {
        console.log('auto');
        var results = await query_automatic(folder, setup, likelihoods);
    } else {
        console.log('manual');
        var results = await query_manual(folder, setup, likelihoods);
    }
    return results;
}

async function query_manual (folder, setup, likelihoods) {
    // setup and train
    await setup_query(folder, setup);
    // test
    for (var i = 0; i < likelihoods.length; i++) {
        var results = await java.test(folder, likelihoods[i].filepath);
        delete results.filename;
        results.class = setup.class;
        likelihoods[i].results.push(results);
    }
    return likelihoods;
}

async function query_automatic (folder, setup, likelihoods) {
    var brands = await db.selectBrands();
    for (var i = 0; i < brands.length; i++) {
        var models = await db.selectModels({brand: brands[i].value});
        for (var j = 0; j < models.length; j++) {
            var os = await db.selectOS({brand: brands[i].value, model: models[j].value});
            for (var h = 0; h < os.length; h++) {
                console.log({brand: brands[i].value, model: models[j].value, os: os[h].value});
                setup.class = {brand: brands[i].value, model: models[j].value, os: os[h].value};
                var likelihoods = await query_manual(folder, setup, likelihoods);
            }
        }
    }
    var likelihoods = utils.sortLikelihoods(likelihoods);
    return likelihoods;
}

function classIsAllAny (_class) {
    if (_class.brand === 'Any' && _class.model === 'Any' && _class.os === 'Any') {
        return true;
    } else {
        return false;
    }
}

async function setup_query (folder, setup) {
    // query for class A and B
    var videosA = await db.selectClassA(setup.class);
    var videosB = await db.selectClassB(setup.class);
    var jsonA = JSON.stringify({list: videosA});
    var jsonB = JSON.stringify({list: videosB});
    // save list of files for class A and B
    fs.writeFileSync(path.join(upload.uploadsDir(), folder, '/listA.json'), jsonA, 'utf8', function () {});
    fs.writeFileSync(path.join(upload.uploadsDir(), folder, '/listB.json'), jsonB, 'utf8', function () {});
    // train
    var exitCodeTrain = await java.train(folder);
}

function setup_likehoods (filenames) {
    var likelihoods = [];
    for (var i = 0; i < filenames.length; i++) {
        if (filenames[i].class === undefined) {
            likelihoods.push({filename: path.basename(filenames[i].filename), filepath: filenames[i].filename, results: []});
        } else {
            likelihoods.push({filename: path.basename(filenames[i].filename), filepath: filenames[i].filename,
                              class: filenames[i].class, results: []});
        }
    }
    return likelihoods;
}

// exports
module.exports = {
    query,
    querytest
}
