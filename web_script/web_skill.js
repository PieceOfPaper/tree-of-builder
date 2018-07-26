module.exports = function(app){
  var express = require('express');
  var fs = require('fs');
  var csv = require('csv-parser');
  
  var route = express.Router();

  var search_box = fs.readFileSync('./web/Skill/search_box.html');
  var skillTable = [];
  fs.createReadStream('./data/skill.ies')
    .pipe(csv())
    .on('data', function (data) {
      skillTable.push(data);
    });

  route.get('/', function (request, response) {

    var resultArray = [];
    if (request.query.searchName === undefined || request.query.searchName === ''){
      for (var i = 0; i < skillTable.length; i ++){
        if (resultArray.length >= 10) break;
        resultArray.push(skillTable[i]);
      }
    } else {
      for (var i = 0; i < skillTable.length; i ++){
        if (resultArray.length >= 10) break;

        if (request.query.searchType === "Name" && skillTable[i].Name.indexOf(request.query.searchName) > -1)
          resultArray.push(skillTable[i]);
        else if (request.query.searchType === "ClassName" && skillTable[i].ClassName.indexOf(request.query.searchName) > -1)
        resultArray.push(skillTable[i]);
      }
    }

    var output = '<html>';
    output +=   '<head>';
    output +=     '<title>Skill Page</title>';
    output +=     '<link rel="stylesheet" type="text/css" href="../style.css">';
    output +=   '</head>';
    output +=   '<body>';
    output += search_box.toString();
    output +=     '<br/>';
    output +=     '<table style="width:100%">';
    for (var i = 0; i < resultArray.length; i ++){
      output += '<tr>';
      output += '<td>' + resultArray[i].ClassID + '</td>';
      output += '<td>' + resultArray[i].Name + '</td>';
      output += '<td>' + resultArray[i].ClassName + '</td>';
      output += '</tr>';
    }
    output +=     '</table>';
    output +=   '</body>';
    output += '</html>';

    response.send(output);
    //console.log(request.query.searchType + " " + request.query.searchName);
  });

  return route;
}