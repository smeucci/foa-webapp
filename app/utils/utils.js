// ========
// utils.js
// ========

// require
var path = require('path');
var fs = require('fs-extra');
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

// exports
module.exports = {
    isEmpty,
    maxLikelihood
}
