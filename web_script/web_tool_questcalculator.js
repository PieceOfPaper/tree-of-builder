module.exports = function(app, tableData, scriptData){
    var express = require('express');
    var fs = require('fs');
    //var url = require('url');
    var tos = require('../my_modules/TosModule');
    
    var route = express.Router();
  
    var layout = fs.readFileSync('./web/Layout/tool_questcalculator.html');
    route.get('/', function (request, response) {

        var from=0;
        var to=0;

        if (request.query.from != undefined && request.query.from != ''){
            from=request.query.from;
        }
        if (request.query.to != undefined && request.query.to != ''){
            to=request.query.to;
        }

        var questList = [];
        var itemSum = [];
        var expSum = 0;
        for (var i=from;i<=to;i++){
            var questData = tos.FindDataClassID(tableData,'questprogresscheck',i);
            if (questData==undefined) continue;
            questList.push(questData.ClassName);
            var questAutoData = tos.FindDataClassName(tableData,'questprogresscheck_auto',questData.ClassName);
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
        if (from > 0 && to > 0){
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
                resultString += tos.GetQuestString(tableData,questList[param]);
            }
        }

        output = output.replace(/%ResultString%/g, resultString);
        response.send(output);
    });
    return route;
}