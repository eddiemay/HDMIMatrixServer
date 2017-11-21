var selectedInput = undefined;
var selectedOutput = undefined;
function sendSelection() {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open('PATCH', 'api/outputs/' + selectedOutput, true);
  xmlHttp.send(JSON.stringify({entity: {selected: selectedInput}, updateMask: ['selected']}));
  document.getElementById('input' + selectedInput).className = '';
  document.getElementById('output' + selectedOutput).className = '';
  selectedInput = undefined;
  selectedOutput = undefined;
}
function setInput(input) {
  if (selectedInput) {
    document.getElementById('input' + selectedInput).className = '';
  }
  selectedInput = input;
  if (selectedOutput) {
    sendSelection();
  } else {
    document.getElementById('input' + selectedInput).className = 'selected';
  }
}
function setOutput(output) {
  if (selectedOutput) {
    document.getElementById('output' + selectedOutput).className = '';
  }
  selectedOutput = output;
  if (selectedInput) {
    sendSelection();
  } else {
    document.getElementById('output' + selectedOutput).className = 'selected';
  }
}
function togglePower() {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open('GET', 'api/power:toggle', true);
  xmlHttp.send(null);
}
function refreshInputs() {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function() {
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
      var response = JSON.parse(xmlHttp.response);
      var inputs = response.result;
      var tags = '';
      for (var i = 0; i < inputs.length; i++) {
        var input = inputs[i];
        tags += '<div class="device">'
            + '<img id="input' + input.id + '" src="' + input.image + '" onclick="setInput(' + input.id + ')"/>'
            + '<div>' + input.name + '</div></div>';
      }
      document.getElementById('inputs').innerHTML = tags;
    }
  };
  xmlHttp.open('GET', 'api/inputs', true);
  xmlHttp.send(null);
}
function refreshOutputs() {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function() {
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
      var response = JSON.parse(xmlHttp.response);
      var outputs = response.result;
      tags = '';
      for (var i = 0; i < outputs.length; i++) {
        var output = outputs[i];
        tags += '<div class="device">'
            + '<img id="output' + output.id + '" src="' + output.image + '" onclick="setOutput(' + output.id + ')"/>'
            + '<div>' + output.name + '</div></div>';
      }
      document.getElementById('outputs').innerHTML = tags;
    }
  };
  xmlHttp.open('GET', 'api/outputs', true);
  xmlHttp.send(null);
}
refreshInputs();
refreshOutputs();
