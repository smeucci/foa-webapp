
function appendOption(id, data) {
    $.each(data, (i, item) => {
        $(id).append($('<option>', {
            value: item.value,
            text: item.text
        }))
    })
}

function resetSelect(id) {
    $(id).children()
         .remove()
         .end()
         .append($('<option>', { value: 'Any', text: 'Any'}));
}

function loadMakers() {
    $.get('/makers', function (data) {
        appendOption('#sel-makers', data)
    })
}

function loadModels() {
    var maker = $( "#sel-makers option:selected" ).val();
    resetSelect('#sel-models')
    resetSelect('#sel-os')
    $.post('/models', {maker: maker}, function (data) {
        appendOption('#sel-models', data);
    })
}

function loadOS() {
    var maker = $( "#sel-makers option:selected" ).val();
    var model = $( "#sel-models option:selected" ).val();
    resetSelect('#sel-os')
    $.post('/os', {maker: maker, model: model}, function (data) {
        appendOption('#sel-os', data);
    })
}

function selectedClass() {
    var maker = $( "#sel-makers option:selected" ).val();
    var model = $( "#sel-models option:selected" ).val();
    var os = $( "#sel-os option:selected" ).val();
    $('#output').text("Class: " + maker + ", " + model + ", " + os)
}
