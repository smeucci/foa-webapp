// =========
// upload.js
// =========

// require
var fs = require('fs-extra');
var path = require('path');
var formidable = require('formidable');

// functions
function upload (req, random) {
    return new Promise ( function (resolve, reject) {
        var form = new formidable.IncomingForm();
        form.multiples = true;
        form.uploadDir = path.join(__dirname, '../uploads/', random);
        fs.mkdirSync(form.uploadDir);

        form.on('file', function(field, file) {
            fs.rename(file.path, path.join(form.uploadDir, file.name), function () {});
        });

        form.on('error', function(err) {
            console.log('An error has occured: ' + err);
            return resolve(false)
        });

        form.on('end', function() {
            return resolve(true)
        });

        form.parse(req);
    })
}

// exports
module.exports = {
    upload
}
