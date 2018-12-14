module.exports = function(app, tableData, scriptData){
    var express = require('express');
    var fs = require('fs');
    //var url = require('url');
    var tos = require('../my_modules/TosModule');
    
    var route = express.Router();
  
    route.get('/', function (request, response) {
        var monsterTable = tableData['monster'];

        // id값이 존재하는 경우, 상세 페이지로 이동
        if (request.query.id != undefined && request.query.id != ''){
          for (var i = 0; i < monsterTable.length; i ++){
            if (monsterTable[i].ClassID === Number(request.query.id)){
                monsterDetailPage(i, request, response);
              return;
            }
          }
        }

        response.send('');
    });
  
    function monsterDetailPage(index, request, response) {
        var monsterTable = tableData['monster'];

        var output = JSON.stringify(monsterTable[index]);
        response.send(output);
    }
  
    return route;
  }