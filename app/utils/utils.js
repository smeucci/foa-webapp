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

// exports
module.exports = {
    isEmpty,
    random,
    setupTest,
    sortLikelihoods
}
