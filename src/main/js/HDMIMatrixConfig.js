var inputs = undefined;
var outputs = undefined;
function redraw() {
  var innerHTML = '';
  for (var i = 0; i < inputs.length; i++) {
    var input = inputs[i];
    innerHTML += '<tr><td>INPUT</td>'
        + '<td>' + input.id + '</td>'
        + '<td><input name="name" type="text" value="' + input.name + '" onblur="update(\'inputs\', ' + input.id +', this)"></td>'
        + '<td><input name="image" type="text" value="' + input.image + '" onblur="update(\'inputs\', ' + input.id +', this)"></td>'
        + '<td><button onclick="remove(\'inputs\', ' + input.id + ')">Remove</button></td></tr>';
  }
  for (var i = 0; i < outputs.length; i++) {
    var output = outputs[i];
    innerHTML += '<tr><td>OUTPUT</td>'
        + '<td>' + output.id + '</td>'
        + '<td><input name="name" type="text" value="' + output.name + '" onblur="update(\'outputs\', ' + output.id +', this)"></td>'
        + '<td><input name="image" type="text" value="' + output.image + '" onblur="update(\'outputs\', ' + output.id +', this)"></td>'
        + '<td><button onclick="remove(\'outputs\', ' + output.id + ')">Remove</button></td></tr>';
  }
  document.getElementById('items').innerHTML = innerHTML;
}
function findIndex(items, id) {
  for (var i = 0; i < items.length; i++) {
    if (items[i].id == id) {
      return i;
    }
  }
  return -1;
}
function create() {
  var type = document.getElementById("type").value;
  var newItem = {
    id: parseInt(document.getElementById("port").value, 10),
    name: document.getElementById("name").value,
    image: document.getElementById("image").value
  };
  var items = (type == 'inputs') ? inputs : outputs;
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function() {
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
      newItem = JSON.parse(xmlHttp.response);
      items.push(newItem);
      redraw();
    }
  };
  xmlHttp.open('PUT', 'api/' + type + '/' + newItem.id, true);
  xmlHttp.send(JSON.stringify({entity: newItem}));
}
function refresh() {
  inputs = undefined;
  outputs = undefined;
  var inputRequest = new XMLHttpRequest();
  inputRequest.onreadystatechange = function() {
    if (inputRequest.readyState == 4 && inputRequest.status == 200) {
      var response = JSON.parse(inputRequest.response);
      inputs = response.result;
      if (outputs) {
        redraw();
      }
    }
  };
  inputRequest.open('GET', 'api/inputs', true);
  inputRequest.send(null);

  var outputRequest = new XMLHttpRequest();
  outputRequest.onreadystatechange = function() {
    if (outputRequest.readyState == 4 && outputRequest.status == 200) {
      var response = JSON.parse(outputRequest.response);
      outputs = response.result;
      if (inputs) {
        redraw();
      }
    }
  };
  outputRequest.open('GET', 'api/outputs', true);
  outputRequest.send(null);
}
function update(type, id, element) {
  var updateRequest = {
    entity: {},
    updateMask: [element.name]
  };
  updateRequest.entity[element.name] = element.value;
  var xmlHttp = new XMLHttpRequest();
  var items = (type == 'inputs') ? inputs : outputs;
  var idx = findIndex(items, id);
  xmlHttp.onreadystatechange = function() {
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
      items[idx] = JSON.parse(xmlHttp.response);
      redraw();
    }
  };
  xmlHttp.open('PATCH', '/api/' + type + '/' + id, true);
  xmlHttp.send(JSON.stringify(updateRequest));
}
function remove(type, id) {
  var xmlHttp = new XMLHttpRequest();
  var items = (type == 'inputs') ? inputs : outputs;
  var idx = findIndex(items, id);
  xmlHttp.onreadystatechange = function() {
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
      items.splice(idx, 1);
      redraw();
    }
  };
  xmlHttp.open('DELETE', '/api/' + type + '/' + id, true);
  xmlHttp.send(null);
}
refresh();
