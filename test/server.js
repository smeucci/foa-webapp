// ==================
// test - server.js
// ==================

var expect    = require("chai").expect;
var request = require("request");

// tests
describe("Select dropdown options API", function() {

    describe("/GET brands", function() {
        var url = "http://localhost:3000/brands";
        it("returns status 200", function(done) {
            request(url, function(error, response, body) {
                expect(response.statusCode).to.equal(200);
                done();
            });
        });
        var result = '[{"value":"Apple","text":"Apple"},'
                    + '{"value":"Huawei","text":"Huawei"},'
                    + '{"value":"Samsung","text":"Samsung"}]'
        it("return a list of brands options", function(done) {
            request(url, function(error, response, body) {
                expect(body).to.equal(result);
                done();
            });
        });
    });

    describe("/GET models", function() {
        var url = "http://localhost:3000/models?brand=Samsung";
        it("returns status 200", function(done) {
            request(url, function(error, response, body) {
                expect(response.statusCode).to.equal(200);
                done();
            });
        });
        var result = '[{"value":"GalaxyS3","text":"GalaxyS3"},'
                    + '{"value":"GalaxyTrendPlus","text":"GalaxyTrendPlus"}]'
        it("return a list of makers options", function(done) {
            request(url, function(error, response, body) {
                expect(body).to.equal(result);
                done();
            });
        });
    });

    describe("/GET os", function() {
        var url = "http://localhost:3000/os?brand=Samsung&model=GalaxyS3";
        it("returns status 200", function(done) {
            request(url, function(error, response, body) {
                expect(response.statusCode).to.equal(200);
                done();
            });
        });
        var result = '[{"value":"Android-4.0.1","text":"Android 4.0.1"}]'
        it("return a list of os options", function(done) {
            request(url, function(error, response, body) {
                expect(body).to.equal(result);
                done();
            });
        });
    });

});

describe("Upload file API", function () {

    describe("/POST upload", function () {

        var url = "http://localhost:3000/upload";
        it("returns status 200", function() {

        });

        it("upload a file to /uploads folder", function() {

        })

    })

});
