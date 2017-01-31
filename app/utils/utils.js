// ========
// utils.js
// ========

// require
var path = require('path');
var fs = require('fs-extra');
var upload = require(path.join(__dirname, '/../utils/upload'));

// functions
function isEmpty(obj) {
    if (obj == null) return true;
    if (obj.length > 0)    return false;
    if (obj.length === 0)  return true;
    if (typeof obj !== "object") return true;
    for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) return false;
    }
    return true;
}

// exports
module.exports = {
    isEmpty
}
