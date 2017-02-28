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
        equal = isEqual(target.brand + target.model, prediction.brand + prediction.model)
    } else {
        equal = isEqual(target.brand + target.model + target.os + target.version,
                        prediction.brand + prediction.model + prediction.name + prediction.version)
    }
    return equal;
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

// exports
module.exports = {
    isEmpty,
    random,
    setupTest,
    sortLikelihoods,
    computeStats,
    parseConfig
}
