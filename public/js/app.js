
function appendOption(id, data) {
    $.each(data, (i, item) => {
        $(id).append($('<option>', {
            value: item.value,
            text: item.text
        }));
    });
}

function resetSelect(id) {
    $(id).children()
         .remove()
         .end()
         .append($('<option>', { value: 'Any', text: 'Any'}));
}

function loadBrands() {
    $.get('/brands', function (data) {
        appendOption('#sel-brands', data);
    });
}

function loadModels() {
    var brand = $( "#sel-brands option:selected" ).val();
    resetSelect('#sel-models');
    resetSelect('#sel-os');
    $.get('/models', {brand: brand}, function (data) {
        appendOption('#sel-models', data);
    });
}

function loadOS() {
    var brand = $( "#sel-brands option:selected" ).val();
    var model = $( "#sel-models option:selected" ).val();
    resetSelect('#sel-os');
    $.get('/os', {brand: brand, model: model}, function (data) {
        appendOption('#sel-os', data);
    });
}

function selectedClass() {
    var brand = $( "#sel-brands option:selected" ).val();
    var model = $( "#sel-models option:selected" ).val();
    var os = $( "#sel-os option:selected" ).val();
    $('#output').text("Class: " + brand + ", " + model + ", " + os);
}


//TODO refactor
function resetProgressBar () {
    $('#upload-input').click();
    $('.progress-bar').text('0%');
    $('.progress-bar').width('0%');
    document.getElementById("warning").style.display = "none";
}

function upload () {
  var files = $('#upload-input').get(0).files;

  // limit max number of files that can be uploaded per time
  if (files.length > 3) {
      document.getElementById("warning").style.display = "block";
      $('#upload-input').value = '';
      return;
  }

  if (files.length > 0) {
      var formData = new FormData();
      for (var i = 0; i < files.length; i++) {
          var file = files[i];
          formData.append('uploads[]', file, file.name);
      }
      $.post({
          url: '/query',
          data: formData,
          processData: false,
          contentType: false,
          success: function (data){ console.log('Upload success: ' + data.success); },
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
