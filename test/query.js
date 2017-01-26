// ==================
// test - upload.js
// ==================

// require
var fs = require('fs-extra');
var path = require('path');
var request = require("request");
var expect    = require("chai").expect;

// tests
describe("Query API", function () {

    var url = "http://localhost:3000/query";
    var filename = 'test.xml';

    describe("/POST query", function () {
        it("return status 200", function(done) {
            var formData = {file: fs.createReadStream(path.join(__dirname, '/uploads/', filename))};
            request.post({url: url, formData: formData}, function (error, response, body) {
                var body = JSON.parse(body);
                var resultFolder = path.join(__dirname, '../app/uploads/', body.folder, '/');
                expect(response.statusCode).to.equal(200);
                fs.removeSync(resultFolder)
                done()
            })
        });
    });

    describe("/POST query (upload phase)", function () {
        it("upload a file to /uploads folder", function(done) {
            var formData = {file: fs.createReadStream(path.join(__dirname, '/uploads/', filename))};
            request.post({url: url, formData: formData}, function (error, response, body) {
                var result = false;
                var body = JSON.parse(body);
                var resultFolder = path.join(__dirname, '../app/uploads/', body.folder, '/')
                if (fs.existsSync(path.join(resultFolder, filename))) {result = true}
                expect(body.success).to.equal(true)
                expect(result).to.equal(true)
                fs.removeSync(resultFolder)
                done()
            })
        });
    });

    describe("/POST query (run phase)", function () {
        it("run the query and return likelihood", function() {

        });
    });

});
