module.exports = function(app){
  var express = require('express');
  var fs = require('fs');
  var csv = require('csv-parser');
  
  var route = express.Router();

  var search_box = fs.readFileSync('./web/Skill/search_box.html');

  route.get('/', function (request, response) {

    var output = '<html>';
    output +=   '<head>';
    output +=     '<title>Skill Page</title>';
    output +=     '<link rel="stylesheet" type="text/css" href="../style.css">';
    output +=   '</head>';
    output +=   '<body>';
    output += search_box.toString();
    output +=     '<br/>';
    output +=   '</body>';
    output += '</html>';

    response.send(output);
    console.log(request.query.searchType + " " + request.query.searchName);
  });

  app.get('/:searchType/:searchName', function(request, response){

    var output = '<html>';
    output +=   '<head>';
    output +=     '<title>Skill Page (Searched)</title>';
    output +=     '<link rel="stylesheet" type="text/css" href="../style.css">';
    output +=   '</head>';
    output +=   '<body>';
    output += search_box.toString();
    output +=     '<br/>';
    output +=   '</body>';
    output += '</html>';

    response.send(output);
    
    console.log(request.params.searchType + " " + request.params.searchName);
  })

  return route;
}