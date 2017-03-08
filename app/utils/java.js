// =======
// java.js
// =======

// require
var path = require('path');
var spawn = require('child_process').spawn;
var foa = path.join(__dirname, '/../jar/foa.jar');
var vft = path.join(__dirname, '/../jar/vft.jar');
var upload = require(path.join(__dirname, '/upload'));
var utils = require(path.join(__dirname, '/utils'));
var config = utils.parseConfig(path.join(__dirname, '/../config/config.conf'));

// functions
function train (folder) {
    return new Promise (function (resolve, reject) {
        var listA = path.join(folder, '/listA.json');
        var listB = path.join(folder, '/listB.json');
        var cmd = "/usr/bin/java -jar " + foa + " --train -lA " + listA + " -lB " + listB + " -o " + folder
        var child = spawn(cmd, {shell: true});
        child.on('exit', function (exitCode) {
            return resolve(exitCode);
        });
        child.on('error', function (data) {
            console.log(data);
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

function compare (ref, query, folder) {
    return new Promise (function (resolve, reject) {
        var folderpath = path.join(upload.uploadsDir(), folder);
        var refpath = (ref.endsWith(".xml")) ? path.join(folderpath, ref) : path.join(folderpath, ref + ".xml");
        var querypath = (query.endsWith(".xml")) ? path.join(folderpath, query) : path.join(folderpath, query + ".xml");
        var cmd = "/usr/bin/java -jar " + vft + " -c -i " + refpath + " -i2 " + querypath;
        var child = spawn(cmd, {shell: true});
        child.stdout.on('data', function (data) {
            var res = JSON.parse(data.toString().replace(/(\r\n|\n|\r)/gm,""));
            return resolve(res);
        });
    });
}

function test (folder, configfolder, filename) {
    return new Promise (function (resolve, reject) {
        var configA = path.join(configfolder, '/configA-w.xml');
        var configB = path.join(configfolder, '/configB-w.xml');
        var filepath = filename.endsWith(".xml") ? filename : filename.concat(".xml");
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
        var dataset = config.TRAININGDATASET;
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
        var dataset = config.TESTINGDATASET;
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
    compare,
    test,
    init,
    updateTraining,
    updateTesting
}
