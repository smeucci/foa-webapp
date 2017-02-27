// ========
// train.js
// ========

// require
var path = require('path');
var fs = require('fs-extra');
var java = require(path.join(__dirname, '/../utils/java'));
var db = require(path.join(__dirname, '/../models/db'));
var utils = require(path.join(__dirname, '/../utils/utils'));
var config = utils.parseConfig(path.join(__dirname, '/../config/config.conf'));

// functions
async function train (req, res) {
    var classesfolder = config.CLASSESFOLDER.replace(/\s+/g,'');
    if (!fs.existsSync(classesfolder)) { fs.mkdirSync(classesfolder); }
    var brands = await db.selectBrands();
    for (var i = 0; i < brands.length; i++) {
        var models = await db.selectModels({brand: brands[i].value});
        models.push({value: 'Any', text: 'Any'});
        for (var j = 0; j < models.length; j++) {
            var os = await getOS(brands[i], models[j]);
            for (var h = 0; h < os.length; h++) {
                // create folder
                var folder = path.join(classesfolder, brands[i].value + models[j].value + os[h].value);
                if (!fs.existsSync(folder)) { fs.mkdirSync(folder); }
                // setup
                console.log({brand: brands[i].value, model: models[j].value, os: os[h].value});
                await setup(folder, {brand: brands[i].value, model: models[j].value, os: os[h].value});
                // train
                var exitCodeTrain = await java.train(folder);

            }
        }
    }
    console.log('training done.');
    res.json('training done.');
}

async function getOS (brand, model) {
    if (model.value === 'Any') {
        var os = [{value: 'Any', text: 'Any'}];
    } else {
        var os = await db.selectOS({brand: brand.value, model: model.value});
        if (typeof os != "undefined" && os != null && os.length > 0) {
            os.push({value: 'Any', text: 'Any'});
        }
    }
    return os;
}

async function setup (folder, _class) {
    // query for class A and B
    var videosA = await db.selectClassA(_class);
    var videosB = await db.selectClassB(_class);
    var jsonA = JSON.stringify({list: videosA});
    var jsonB = JSON.stringify({list: videosB});
    // save list of files for class A and B
    fs.writeFileSync(path.join(folder, '/listA.json'), jsonA, 'utf8', function () {});
    fs.writeFileSync(path.join(folder, '/listB.json'), jsonB, 'utf8', function () {});
}


// exports
module.exports = {
    train
}
