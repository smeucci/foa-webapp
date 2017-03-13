
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
    var warning = document.getElementById("warning");
    if (warning != null) { document.getElementById("warning").style.display = "none"; }
}

function resetProgressBarRef () {
    $('#upload-input-ref').click();
    $('.progress-bar').text('0%');
    $('.progress-bar').width('0%');
    $('#files-ref').text('No file chosen');
    var warning = document.getElementById("warning");
    if (warning != null) { document.getElementById("warning").style.display = "none"; }
}

function resetProgressBarQuery () {
    $('#upload-input-query').click();
    $('.progress-bar').text('0%');
    $('.progress-bar').width('0%');
    $('#files-query').text('No file chosen');
    var warning = document.getElementById("warning");
    if (warning != null) { warning.style.display = "none"; }
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

function displayFilesRef () {
    var files = $('#upload-input-ref').get(0).files;
    $('#files-ref').text(files[0].name);
}

function displayFilesQuery () {
    var files = $('#upload-input-query').get(0).files;
    $('#files-query').text(files[0].name);
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
    var data = "";
    if (stats.top === undefined) {
        var correct = ((stats.TP + stats.TN) / (stats.TP + stats.TN + stats.FP + stats.FN)) * 100;
        data = "## stats ## TP: " + stats.TP + ", TN: " + stats.TN
                 + ", FP: " + stats.FP + ", FN: " + stats.FN + ", Correct: " + correct + "%";
        $(".well").append("<p><b>" + data + "</b></p>");
    } else {
        data = "# Brands # TOP 1: " + stats.top.brands.one * 100 + "%, TOP 3: " + stats.top.brands.three * 100 + "%,"
                + " TOP 5: " + stats.top.brands.five * 100 + "%";
        $(".well").append("<p><b>" + data + "</b></p>");
        data = "# Models # TOP 1: " + stats.top.models.one * 100 + "%, TOP 3: " + stats.top.models.three * 100 + "%,"
                + " TOP 5: " + stats.top.models.five * 100 + "%";
        $(".well").append("<p><b>" + data + "</b></p>");
    }
}

function displayCompare (data) {
    $(".well").append("<p><b>" + "# reference: " + data.rq.reference + ", query: " + data.rq.query + "</b></p>");
    $(".well").append("<p class='compare'>" + "- diff: " + data.rq.diff + ", tot: "
     + data.rq.tot + "</p> <button class='btn btn-primary btn-xs extra' onclick='showExtraRef()'>+</button>");
    $(".well").append("<div class='clearfix'></div>");
    var fields = data.rq.fields.split(";");
    fields.pop();
    fields.forEach(function (f, i) {
        $(".well").append("<p id='ref' class='fields'> > "+ f +"</p>");
    })
    $(".well").append("<p><b>" + "# reference: " + data.qr.reference + ", query: " + data.qr.query + "</b></p>");
    $(".well").append("<p class='compare'>" + "- diff: " + data.qr.diff + ", tot: "
     + data.qr.tot + "</p> <button class='btn btn-primary btn-xs extra' onclick='showExtraQuery()'>+</button>");
     $(".well").append("<div class='clearfix'></div>");
    fields = data.qr.fields.split(";");
    fields.pop();
    fields.forEach(function (f) {
        $(".well").append("<p id='query' class='fields'> > "+ f +"</p>");
    })
}

function showExtraRef () {
    var display = $("#ref.fields").css("display");
    if (display === 'none') {
        $("#ref.fields").css("display", "block");
    } else {
        $("#ref.fields").css("display", "none");
    }
}

function showExtraQuery () {
    var display = $("#query.fields").css("display");
    if (display === 'none') {
        $("#query.fields").css("display", "block");
    } else {
        $("#query.fields").css("display", "none");
    }
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

function comparet () {
    var ref = $('#upload-input-ref').get(0).files[0];
    var query = $('#upload-input-query').get(0).files[0];

    if (ref == null || query == null) { return; }

    var formData = new FormData();
    formData.append('info',  '{ "ref": "' + ref.name + '", "query": "' + query.name + '" }');
    formData.append('uploads[]', ref, ref.name);
    formData.append('uploads[]', query, query.name);

    $.post({
        url: '/comparet',
        data: formData,
        mimeType:'multipart/form-data',
        processData: false,
        contentType: false,
        success: function (data) {
            $(".well").text("");
            data = JSON.parse(data);
            displayCompare(data);
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
