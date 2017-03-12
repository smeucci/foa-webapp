// ========
// utils.js
// ========

// require
var path = require('path');
var fs = require('fs-extra');
var formidable = require('formidable');
var upload = require(path.join(__dirname, '/../utils/upload'));

// functions
function isEmpty (obj) {
    if (obj == null) return true;
    if (obj.length > 0)    return false;
    if (obj.length === 0)  return true;
    if (typeof obj !== "object") return true;
    for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) return false;
    }
    return true;
}

function random (length) {
    const chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
    return result;
}

function sortLikelihoods (likelihoods) {
    for (var i = 0; i < likelihoods.length; i++) {
        likelihoods[i].results.sort(function (a, b) {
            if (a.loglikelihood < b.loglikelihood) { return 1; }
            else if (a.loglikelihood == b.loglikelihood) { return 0; }
            else { return -1; }
        });
    }
    return likelihoods;
}

function setupTest (req, folder) {
    return new Promise (function (resolve, reject) {
        // create folder
        fs.mkdirSync(path.join(upload.uploadsDir(), folder));
        // parse parameters (class)
        results = {success: true, class: {brand: req.query.brand, model: req.query.model, os: req.query.os}}
        // resolve
        resolve(results);
    });
}

function computeStats (testfiles) {
    stats = {TP: 0, TN: 0, FP: 0, FN: 0};
    testfiles.forEach(function (t) {
        var res = t.results[0];
        var equal = compareClass(t.class, res.class);
        var positive = (res.loglikelihood > 0) ? true : false;
        stats = updateStats(equal, positive, stats);
    })
    return stats;
}

function compareClass (target, prediction) {
    var equal = false;
    if (prediction.model == 'Any') {
        equal = isEqual(target.brand, prediction.brand);
    } else if (prediction.os == 'Any' || target.os == 'null null') {
        equal = isEqual(target.brand + target.model, prediction.brand + prediction.model);
    } else {
        equal = isEqual(target.brand + target.model + target.os + target.version,
                        prediction.brand + prediction.model + prediction.name + prediction.version);
    }
    return equal;
}

function compareClassBrand (target, prediction) {
    return isEqual(target.brand, prediction.brand);
}

function compareClassBrandModel (target, prediction) {
    return isEqual(target.brand + target.model, prediction.brand + prediction.model);
}

function compareClassBrandModelOS (target, prediction) {
    return isEqual(target.brand + target.model + target.os + target.version,
                    prediction.brand + prediction.model + prediction.name + prediction.version);
}

function updateStats (a, b, stats) {
    if (a == true && b == true) {
        stats.TP += 1;
    } else if (a == false && b == false) {
        stats.TN += 1;
    } else if (a == false && b == true) {
        stats.FP += 1;
    } else if (a == true && b == false) {
        stats.FN += 1;
    }
    return stats;
}

function isEqual (a, b) {
    if (a == b) { return true }
    else { return false }
}

function parseConfig (config) {
    config = fs.readFileSync(config);
    var regex = /^([A-Z]+)(.*)$/mg;
    var configObject = {};
    var match;
    while (match = regex.exec(config)) {
        var key = match[1], values = match[2].split(",");
        if (values.length === 1) {
            configObject[key] = values[0];
        }
        else {
            configObject[key] = values.map(function(value){
                return value.trim();
            });
        }
    }
    return configObject;
}

function ROCSetup (testfiles) {
    testfiles.forEach(function (t) {
        t.results.forEach(function (res) {
            var likelihood = res.loglikelihood;
            var label = (compareClass(t.class, res.class) == true) ? 1 : 0;
            var output = likelihood + ";" + label + "\n";
            fs.appendFile("/home/saverio/Projects/Tests/SourceIdentification/compares.txt", output, 'utf8', function () {});
        })
    })
}

function computeTopX (testfiles) {
    var TOP = { brands: {one: 0, three: 0, five: 0},
                models: {one: 0, three: 0, five: 0} };
    testfiles.forEach(function (t) {
        var i = 0;
        var flag1 = false;
        while (i < 5 && flag1 == false) {
            var label = (compareClassBrand(t.class, t.results[i].class) == true) ? 1 : 0;
            if (i == 0 && label == 1) { TOP.brands.one += 1; }
            if (i < 3 && label == 1) { TOP.brands.three += 1; }
            if (i < 5 && label == 1) { TOP.brands.five += 1; }
            if (label == 1) { flag1 = true; }
            i += 1;
        }

        var j = 0;
        var flag2 = false;
        while (j < 5 && flag2 == false) {
            var label = (compareClassBrandModel(t.class, t.results[j].class) == true) ? 1 : 0;
            if (j == 0 && label == 1) { TOP.models.one += 1; }
            if (j < 3 && label == 1) { TOP.models.three += 1; }
            if (j < 5 && label == 1) { TOP.models.five += 1; }
            if (label == 1) { flag2 = true; }
            j += 1;
        }
    })
    TOP.brands.one = TOP.brands.one / testfiles.length;
    TOP.brands.three = TOP.brands.three / testfiles.length;
    TOP.brands.five = TOP.brands.five / testfiles.length;
    TOP.models.one = TOP.models.one / testfiles.length;
    TOP.models.three = TOP.models.three / testfiles.length;
    TOP.models.five = TOP.models.five / testfiles.length;
    return TOP;
}

// exports
module.exports = {
    isEmpty,
    random,
    setupTest,
    sortLikelihoods,
    computeStats,
    parseConfig,
    ROCSetup,
    computeTopX
}
