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
  

    var layout_detail = fs.readFileSync('./web/MonsterPage/detail.html');
    function monsterDetailPage(index, request, response) {
        var monsterTable = tableData['monster'];

        var output = layout_detail.toString();
        output = output.replace(/%Icon%/g, '<img src="../img/icon/monillust/' + monsterTable[index].Icon.toLowerCase() + '.png" />');
        output = output.replace(/%Name%/g, monsterTable[index].Name);
        output = output.replace(/%ClassName%/g, monsterTable[index].ClassName);
        output = output.replace(/%ClassID%/g, monsterTable[index].ClassID);
        output = output.replace(/%Desc%/g, monsterTable[index].Desc);

        output = output.replace(/%Level%/g, monsterTable[index].Level);
        output = output.replace(/%Attribute%/g, monsterTable[index].Attribute);
        output = output.replace(/%RaceType%/g, monsterTable[index].RaceType);
        output = output.replace(/%ArmorMaterial%/g, monsterTable[index].ArmorMaterial);
        output = output.replace(/%MoveType%/g, monsterTable[index].MoveType);
        output = output.replace(/%Size%/g, monsterTable[index].Size);
        output = output.replace(/%MonRank%/g, monsterTable[index].MonRank);

        response.send(output);
    }
  
    return route;
  }