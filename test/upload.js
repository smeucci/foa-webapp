// ==================
// test - upload.js
// ==================

// require
var fs = require('fs');
var path = require('path');
var request = require("request");
var expect    = require("chai").expect;

// tests
describe("Upload file API", function () {

    describe("/POST upload", function () {
        var url = "http://localhost:3000/upload";
        it("return status 200", function(done) {
            var filename = '0001.mp4.xml'
            var resultFilename = path.join(__dirname, '../app/uploads/', filename)
            var formData = {file: fs.createReadStream(path.join(__dirname, '/uploads/', filename))};
            request.post({url: url, formData: formData}, function (error, response, body) {
                expect(response.statusCode).to.equal(200)
                fs.unlink(resultFilename, function () {})
                done()
            })
        });

        it("upload a file to /uploads folder", function(done) {
            var filename = '0002.mp4.xml'
            var resultFilename = path.join(__dirname, '../app/uploads/', filename)
            var formData = {file: fs.createReadStream(path.join(__dirname, '/uploads/', filename))};
            request.post({url: url, formData: formData}, function (error, response, body) {
                var result = false
                if (fs.existsSync(resultFilename)) {result = true}
                expect(body).to.equal("success")
                expect(result).to.equal(true)
                fs.unlink(resultFilename, function () {})
                done()
            })
        });
    });

});
