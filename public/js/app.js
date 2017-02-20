
function appendOption (id, data) {
    $.each(data, (i, item) => {
        $(id).append($('<option>', {
            value: item.value,
            text: item.text
        }));
    });
}

function resetSelect (id) {
    $(id).children()
         .remove()
         .end()
         .append($('<option>', { value: 'Any', text: 'Any'}));
}

function loadBrands () {
    $.get('/brands', function (data) {
        appendOption('#sel-brands', data);
    });
}

function loadModels () {
    var brand = $( "#sel-brands option:selected" ).val();
    resetSelect('#sel-models');
    resetSelect('#sel-os');
    $.get('/models', {brand: brand}, function (data) {
        appendOption('#sel-models', data);
    });
}

function loadOS () {
    var brand = $( "#sel-brands option:selected" ).val();
    var model = $( "#sel-models option:selected" ).val();
    resetSelect('#sel-os');
    $.get('/os', {brand: brand, model: model}, function (data) {
        appendOption('#sel-os', data);
    });
}

function selectedClass () {
    var brand = $( "#sel-brands option:selected" ).val();
    var model = $( "#sel-models option:selected" ).val();
    var os = $( "#sel-os option:selected" ).val();
    $('#output').text("Class: " + brand + ", " + model + ", " + os);
}

function download () {
    window.open('/download')
}

function resetProgressBar () {
    $('#upload-input').click();
    $('.progress-bar').text('0%');
    $('.progress-bar').width('0%');
    $('#files').text('No file chosen');
    document.getElementById("warning").style.display = "none";
}

function cleanOutput () {
    $('#output').text('...');
}

function displayFiles () {
    var files = $('#upload-input').get(0).files;
    // limit max number of files that can be uploaded per time
    if (files.length > 3) { //TODO change max
        document.getElementById("warning").style.display = "block";
    } else if (files.length == 1) {
        $('#files').text(files[0].name);
    } else if (files.length > 1 && files.length <= 3){
        $('#files').text(files.length + ' files');
    }
}

function displayResults (results) {
    for (var i = 0; i < results.length; i++) {
        delete results[i].filepath;
        var _class;
        if (results[i].class === undefined) {
            label = "";
        } else {
            label = ", label: " + results[i].class.brand + " " + results[i].class.model + " "
                       + results[i].class.os + " " + results[i].class.version;
        }
        var video = "# filename: " + results[i].filename + label + " #";
        $(".well").append("<p><b>" + video + "</b></p>");
        var num = (results[i].results.length == 1) ? 1 : 5;
        for (var j = 0; j < num; j++) {
            var data = "- loglikelihood: " + results[i].results[j].loglikelihood + ", class: " + results[i].results[j].class.brand
                     + " " + results[i].results[j].class.model + " " + results[i].results[j].class.os;
            $(".well").append("<p>" + data + "</p>");
        }
    }
}

function displayStats (stats) {
    var correct = ((stats.TP + stats.TN) / (stats.TP + stats.TN + stats.FP + stats.FN)) * 100;
    var data = "## stats ## TP: " + stats.TP + ", TN: " + stats.TN
             + ", FP: " + stats.FP + ", FN: " + stats.FN + ", Correct: " + correct + "%";
    $(".well").append("<p><b>" + data + "</b></p>");
}

function query () {
  var files = $('#upload-input').get(0).files;

  // limit max number of files that can be uploaded per time
  if (files.length > 3) { $('#upload-input').value = ''; return; }

  var brand = $( "#sel-brands option:selected" ).val();
  var model = $( "#sel-models option:selected" ).val();
  var os = $( "#sel-os option:selected" ).val();
  var device = '{ "brand": "' + brand + '", ' + '"model": "' + model + '", "os": "' + os + '"}';

  if (files.length > 0) {
      var formData = new FormData();
      formData.append('class', device)
      for (var i = 0; i < files.length; i++) {
          var file = files[i];
          formData.append('uploads[]', file, file.name);
      }
      $.post({
          url: '/query',
          data: formData,
          mimeType:'multipart/form-data',
          processData: false,
          contentType: false,
          success: function (data) {
              $(".well").text("");
              data = JSON.parse(data);
              console.log(data);
              console.log('Upload success: ' + data.success);
              displayResults(data.results);
          },
          xhr: function () {
              var xhr = new XMLHttpRequest();
              xhr.upload.addEventListener('progress', function(evt) {
                  if (evt.lengthComputable) {
                      var percentComplete = evt.loaded / evt.total;
                      percentComplete = parseInt(percentComplete * 100);

                      $('.progress-bar').text(percentComplete + '%');
                      $('.progress-bar').width(percentComplete + '%');

                      if (percentComplete === 100) {
                          $('.progress-bar').html('Done');
                      }
                  }
              }, false);
              return xhr;
          }
      });
    }
}

function querytest () {
    var brand = $( "#sel-brands option:selected" ).val();
    var model = $( "#sel-models option:selected" ).val();
    var os = $( "#sel-os option:selected" ).val();
    var device = {brand: brand, model: model, os: os};

    $.get('/querytest', device, function (data) {
        $(".well").text("");
        console.log(data)
        console.log('Upload success: ' + data.success);
        displayStats(data.stats);
        displayResults(data.results);
    });
}
