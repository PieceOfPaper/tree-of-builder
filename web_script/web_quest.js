module.exports = function(app, tableData, scriptData){
    var express = require('express');
    var fs = require('fs');
    //var url = require('url');
    var tos = require('../my_modules/TosModule');
    
    var route = express.Router();
  
    route.get('/', function (request, response) {
        var questTable = tableData['questprogresscheck'];

        // id값이 존재하는 경우, 상세 페이지로 이동
        if (request.query.id != undefined && request.query.id != ''){
          for (var i = 0; i < questTable.length; i ++){
            if (questTable[i].ClassID === Number(request.query.id)){
                monsterDetailPage(i, request, response);
              return;
            }
          }
        }

        response.send('');
    });
  

    var layout_detail = fs.readFileSync('./web/QuestPage/detail.html');
    function monsterDetailPage(index, request, response) {
        var questTable = tableData['questprogresscheck'];

        var output = layout_detail.toString();
        output = output.replace(/%Name%/g, questTable[index].Name);
        output = output.replace(/%ClassName%/g, questTable[index].ClassName);
        output = output.replace(/%ClassID%/g, questTable[index].ClassID);
        output = output.replace(/%Desc%/g, questTable[index].Desc);

        output = output.replace(/%Level%/g, questTable[index].Level);
        output = output.replace(/%Attribute%/g, questTable[index].Attribute);
        output = output.replace(/%RaceType%/g, questTable[index].RaceType);
        output = output.replace(/%ArmorMaterial%/g, questTable[index].ArmorMaterial);
        output = output.replace(/%MoveType%/g, questTable[index].MoveType);
        output = output.replace(/%Size%/g, questTable[index].Size);
        output = output.replace(/%MonRank%/g, questTable[index].MonRank);


        //output = output.replace(/%StatScript%/g, statScript);

        response.send(output);
    }
  
    return route;
  }