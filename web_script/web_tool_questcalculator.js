module.exports = function(app, tableData, scriptData){
    var express = require('express');
    var fs = require('fs');
    //var url = require('url');
    var tos = require('../my_modules/TosModule');
    
    var route = express.Router();
  
    var layout = fs.readFileSync('./web/Layout/tool_questcalculator.html');
    route.get('/', function (request, response) {

        var targetId=0;
        if (request.query.targetId != undefined && request.query.targetId != ''){
            targetId=request.query.targetId;
        }

        var questList = [];
        var questLvTemp = 0;
        var questDataTemp = tos.FindDataClassID(tableData,'questprogresscheck',targetId);
        while(questDataTemp!=undefined){
            questLvTemp = questDataTemp.Level;
            if (questList.includes(questDataTemp)==false) questList.push(questDataTemp);

            questDataTemp = tos.FindDataClassName(tableData,'questprogresscheck',questDataTemp['QuestName'+1]);
            if (questDataTemp==undefined) break;
            if (Math.abs(questDataTemp.Level-questLvTemp)>10) break;
        }

        var itemSum = [];
        var expSum = 0;
        for (var i=0;i<questList.length;i++){
            if (questList[i] == undefined) continue;
            var questAutoData = tos.FindDataClassName(tableData,'questprogresscheck_auto',questList[i].ClassName);
            for(var j=1;j<=4;j++){
                if (questAutoData['Success_ItemName'+j] == undefined) continue;
                if (questAutoData['Success_ItemCount'+j] == undefined || questAutoData['Success_ItemCount'+j] == 0) continue;
                if (itemSum[questAutoData['Success_ItemName'+j]]==undefined) itemSum[questAutoData['Success_ItemName'+j]]=0;
                itemSum[questAutoData['Success_ItemName'+j]]+=questAutoData['Success_ItemCount'+j];
            }
            expSum += Number(questAutoData.Success_Exp);
        }

        var output = layout.toString();
        var resultString = '';
        if (targetId > 0){
            resultString += '<table><tbody>';
            resultString += '<tr><td>EXP</td><td>'+expSum.toLocaleString()+'</td></tr>';
            for (param in itemSum){
                resultString += '<tr>';
                resultString += '<td>'+tos.GetItemResultString(tableData, param)+'</td>';
                resultString += '<td>'+itemSum[param].toLocaleString()+'</td>';
                resultString += '</tr>';
            }
            resultString += '</tbody></table>';
            resultString += '<br/>';
            for (param in questList){
                resultString += ' '+tos.GetQuestString(tableData,questList[param].ClassName);
            }
        }

        output = output.replace(/%ResultString%/g, resultString);
        response.send(output);
    });
    return route;
}