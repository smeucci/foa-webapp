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

function maxLikelihood (data, num) {
    var max = Array(num).fill(0);
    var best = Array(num).fill(0);
    for (var i = 0; i < data.length; i++) {
        for (var j = 0; j < data[i].results.length; j++) {
            if (data[i].results[j].likelihood > max[j]) {
                max[j] = data[i].results[j].likelihood;
                best[j] = i;
            }
        }
    }
    return parseMaxLikehood(num, data, best);
}

function parseMaxLikehood (num, data, best) {
    var likelihoods = {results: []};
    for (var i = 0; i < num; i++) {
        var likelihood = {};
        var res = data[best[i]].results[i];
        likelihood.filename = res.filename;
        likelihood.likelihood = res.likelihood;
        likelihood.loglikelihood = res.loglikelihood;
        likelihood.class = res.class;
        likelihoods.results.push(likelihood);
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

// exports
module.exports = {
    isEmpty,
    random,
    maxLikelihood,
    setupTest
}
