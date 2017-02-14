// =======
// java.js
// =======

// require
var path = require('path');
var spawn = require('child_process').spawn;
var foa = path.join(__dirname, '/../jar/foa.jar');
var vft = path.join(__dirname, '/../jar/vft.jar');
var upload = require(path.join(__dirname, '/../utils/upload'));

// funcitons
function train (folder) {
    return new Promise (function (resolve, reject) {
        var output = path.join(upload.uploadsDir(), folder);
        var listA = path.join(output, '/listA.json');
        var listB = path.join(output, '/listB.json');
        var cmd = "/usr/bin/java -jar " + foa + " --train -lA " + listA + " -lB " + listB + " -o " + output
        var child = spawn(cmd, {shell: true});
        child.on('exit', function (exitCode) {
            return resolve(exitCode);
        });
    });
}

function parse (folder) {
    return new Promise (function (resolve, reject) {
        var folderpath = path.join(upload.uploadsDir(), folder);
        var cmd = "/usr/bin/java -jar " + vft + " -b -i " + folderpath + " -o " + folderpath;
        var child = spawn(cmd, {shell: true});
        child.on('exit', function (exitCode) {
            return resolve(exitCode);
        });
    });
}

function test (folder, video) {
    return new Promise (function (resolve, reject) {
        var output = path.join(upload.uploadsDir(), folder);
        var configA = path.join(output, '/configA-w.xml');
        var configB = path.join(output, '/configB-w.xml');
        var filepath = video.filename.endsWith(".xml") ? video.filename : video.filename.concat(".xml");
        //filepath = path.join(output, filepath);
        var cmd = "/usr/bin/java -jar " + foa + " --test -cA " + configA + " -cB " + configB + " -i " + filepath;
        var child = spawn(cmd, {shell: true});
        child.stdout.on('data', function (data) {
            var res = JSON.parse(data.toString().replace(/(\r\n|\n|\r)/gm,""));
            return resolve(res);
        });
    });
}

function init () {
    return new Promise (function (resolve, reject) {
        var db = path.join(__dirname, "/../database/database.db");
        var cmd = "/usr/bin/java -jar " + foa + " --init -i " + db;
        var child = spawn(cmd, {shell: true});
        child.stdout.on('data', function (data) {
            console.log(data.toString());
            return resolve('ok');
        });
    });
}

function updateTraining () {
    return new Promise (function (resolve, reject) {
        var db = path.join(__dirname, "/../database/database.db");
        var dataset = path.join(__dirname, "/../dataset/training");
        var cmd = "/usr/bin/java -jar " + foa + " --update-training -i " + dataset + " -o " + db;
        var child = spawn(cmd, {shell: true});
        child.stdout.on('data', function (data) {
            console.log(data.toString());
        });
        child.on('exit', function (exitCode) {
            return resolve(exitCode);
        })
    });
}

function updateTesting () {
    return new Promise (function (resolve, reject) {
        var db = path.join(__dirname, "/../database/database.db");
        var dataset = path.join(__dirname, "/../dataset/testing/");
        var cmd = "/usr/bin/java -jar " + foa + " --update-testing -i " + dataset + " -o " + db;
        var child = spawn(cmd, {shell: true});
        child.stdout.on('data', function (data) {
            console.log(data.toString());
        });
        child.on('exit', function (exitCode) {
            return resolve(exitCode);
        })
    });
}

// exports
module.exports = {
    train,
    parse,
    test,
    init,
    updateTraining,
    updateTesting
}
