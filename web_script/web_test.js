module.exports = function(app){
  var express = require('express');
  var fs = require('fs');
  var csv = require('csv-parser');
  
  var configTable = [];
  fs.createReadStream('web/Test/config.ies')
    .pipe(csv())
    .on('data', function (data) {
      //console.log('ClassID: %s DefNumValue: %s ClassName: %s Type: %s', data.ClassID, data.DefNumValue, data.ClassName, data.Type);
      configTable.push(data);
    });
  
  var route = express.Router();

  route.get('/', function (req, response) {
  });
  
  route.get('/csv_test', function (req, response) {
    var output = '<h1>Test SCV</h1>';
    for(var i = 0; i < configTable.length; i ++) {
      //console.log('ClassID: %s ClassName: %s', item.ClassID, item.ClassName);
      output += '<p>[' + configTable[i].ClassID + '] ' + configTable[i].ClassName + '</p>';
    }
      //response.writeHead(200, {'Content-Type': 'text/html'});	
      response.send(output);
      
  });

  return route;
}