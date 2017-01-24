// =========
// upload.js
// =========

// require
var fs = require('fs');
var path = require('path');
var formidable = require('formidable');

// functions
function upload (req, res) {
  var form = new formidable.IncomingForm();
  form.multiples = true;
  form.uploadDir = path.join(__dirname, '../uploads');

  form.on('file', function(field, file) {
    fs.rename(file.path, path.join(form.uploadDir, file.name), function () {});
  });

  form.on('error', function(err) {
    console.log('An error has occured: \n' + err);
  });

  form.on('end', function() {
    res.end('success');
  });

  form.parse(req);

}

// exports
module.exports = {
    upload
}
