// =========
// upload.js
// =========

// require
var fs = require('fs-extra');
var path = require('path');
var formidable = require('formidable');

// functions
function upload (req, folder) {
    return new Promise ( function (resolve, reject) {
        var form = new formidable.IncomingForm();
        form.multiples = true;
        form.uploadDir = path.join(uploadsDir(), folder);
        fs.mkdirSync(form.uploadDir);
        form.filenames = [];
        form.on('file', function(field, file) {
            fs.rename(file.path, path.join(form.uploadDir, file.name), function () {});
            form.filenames.push({filename: file.name});
        });

        form.on('field', function(field, value) {
            form.fields = JSON.parse(value);
        });

        form.on('error', function(err) {
            console.log('An error has occured: ' + err);
            return resolve(false);
        });

        form.on('end', function() {
            return resolve({success: true, class: form.fields, filenames: form.filenames});
        });

        form.parse(req);
    })
}

function uploadsDir () {
    return path.join(__dirname, '/../uploads/');
}

// exports
module.exports = {
    upload,
    uploadsDir
}
