module.exports = function(app){
  var express = require('express');
  var fs = require('fs');
  var csv = require('csv-parser');
  var url = require('url');
  
  var route = express.Router();

  var search_box = fs.readFileSync('./web/Skill/search_box.html');
  var skillTable = [];
  fs.createReadStream('../Tree-of-IPF/kr/ies.ipf/skill.ies')
    .pipe(csv())
    .on('data', function (data) {
      skillTable.push(data);
    });

  route.get('/', function (request, response) {
    // id값이 존재하는 경우, 상세 페이지로 이동
    if (request.query.id != undefined && request.query.id != ''){
      for (var i = 0; i < skillTable.length; i ++){
        if (skillTable[i].ClassID.indexOf(request.query.id) > -1){
          skillDetailPage(i, request, response);
          return;
        }
      }
    }

    // string query에 검색 데이터가 있는 경우, 검색 결과 가져옴.
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
      output += '<td><a href="?id=' + resultArray[i].ClassID + '">' + resultArray[i].ClassID + '</a></td>';
      output += '<td><img src="../img/icon/icon_' + resultArray[i].Icon  + '.png"/></td>';
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

  function skillDetailPage(index, request, response) {
    var output = '<html>';
    output +=   '<head>';
    output +=     '<title>' + skillTable[index].Name + '</title>';
    output +=     '<link rel="stylesheet" type="text/css" href="../style.css">';
    output +=   '</head>';
    output +=   '<body>';
    output +=     '<h1>' + skillTable[index].Name + '</h1>';
    output +=     '<p>' + skillTable[index].EngName + '</p>';
    output +=     '<table style="width:100%">';
    output +=       '<tr>';
    output +=         '<td>ClassId</td>';
    output +=         '<td>ClassName</td>';
    output +=         '<td>Job</td>';
    output +=         '<td>Rank</td>';
    output +=       '</tr>';
    output +=       '<tr>';
    output +=         '<td>' + skillTable[index].ClassID + '</td>';
    output +=         '<td>' + skillTable[index].ClassName + '</td>';
    output +=         '<td>' + skillTable[index].Job + '</td>';
    output +=         '<td>' + skillTable[index].Rank + '</td>';
    output +=       '</tr>';
    output +=     '</table>';
    output +=     '<table style="width:100%">';
    output +=       '<tr>';
    output +=         '<td>ClassType</td>';
    output +=         '<td>ValueType</td>';
    output +=         '<td>Attribute</td>';
    output +=         '<td>AttackType</td>';
    output +=         '<td>HitType</td>';
    output +=       '</tr>';
    output +=       '<tr>';
    output +=         '<td>' + skillTable[index].ClassType + '</td>';
    output +=         '<td>' + skillTable[index].ValueType + '</td>';
    output +=         '<td>' + skillTable[index].Attribute + '</td>';
    output +=         '<td>' + skillTable[index].AttackType + '</td>';
    output +=         '<td>' + skillTable[index].HitType + '</td>';
    output +=       '</tr>';
    output +=     '</table>';
    output +=     '<p>' + skillTable[index].Caption + '</p>';
    output +=     '<p>' + skillTable[index].Caption2 + '</p>';
    output +=   '</body>';
    output += '</html>';

    response.send(output);
  }

  return route;
}