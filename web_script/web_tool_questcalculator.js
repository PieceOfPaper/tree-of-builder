module.exports = function(app, serverSetting, serverData){
    var express = require('express');
    var fs = require('fs');
    //var url = require('url');
    var tos = require('../my_modules/TosModule');
    
    var route = express.Router();
  
    var layout = fs.readFileSync('./web/Layout/tool_questcalculator.html');
    route.get('/', function (request, response) {
        tos.RequestLog(request);

        var targetId=0;
        if (request.query.targetId != undefined && request.query.targetId != ''){
            targetId=request.query.targetId;
        }

        var questList = [];
        var questLvTemp = 0;
        var questDataTemp = tos.FindDataClassID(serverData,'questprogresscheck',targetId);
        while(questDataTemp!=undefined){
            questLvTemp = questDataTemp.Level;
            if (questList.includes(questDataTemp)==true) break;
            questList.push(questDataTemp);

            questDataTemp = tos.FindDataClassName(serverData,'questprogresscheck',questDataTemp['QuestName'+1]);
            if (questDataTemp==undefined) break;
            if (Math.abs(questDataTemp.Level-questLvTemp)>10) break;
        }

        var itemSum = [];
        var propertySum = [];
        for (var i=0;i<questList.length;i++){
            if (questList[i] == undefined) continue;
            var questAutoData = tos.FindDataClassName(serverData,'questprogresscheck_auto',questList[i].ClassName);
            for(var j=1;j<=4;j++){
                if (questAutoData['Success_ItemName'+j] == undefined) continue;
                if (questAutoData['Success_ItemCount'+j] == undefined || questAutoData['Success_ItemCount'+j] == 0) continue;
                if (itemSum[questAutoData['Success_ItemName'+j]]==undefined) itemSum[questAutoData['Success_ItemName'+j]]=0;
                itemSum[questAutoData['Success_ItemName'+j]]+=questAutoData['Success_ItemCount'+j];
            }
            if (propertySum['Exp'] == undefined) propertySum['Exp'] = 0;
            if (propertySum['StatByBonus'] == undefined) propertySum['StatByBonus'] = 0;
            propertySum['Exp'] += Number(questAutoData.Success_Exp);
            propertySum['StatByBonus'] += Number(questAutoData.Success_StatByBonus);

            var propertyRewardData = tos.FindDataClassName(serverData,'reward_property',questList[i].ClassName);
            if (propertyRewardData!=undefined){
                if (propertyRewardData['Property']!=undefined && propertyRewardData['Property'].length>0){
                    if (propertySum[propertyRewardData['Property']] == undefined) propertySum[propertyRewardData['Property']] = 0;
                    propertySum[propertyRewardData['Property']] = propertyRewardData['Value'];
                }
                for (var i=1;i<10;i++){
                    if (propertyRewardData['RewardItem'+i]==undefined || propertyRewardData['RewardItem'+i].length==0) continue;
                    if (itemSum[propertyRewardData['RewardItem'+i]]==undefined) itemSum[propertyRewardData['RewardItem'+i]]=0;
                    itemSum[propertyRewardData['RewardItem'+i]]+=propertyRewardData['RewardCount'+i];
                }
            }
        
            var jsQuestRewardData = tos.FindDataClassName(serverData,'reward_property','JS_Quest_Reward_'+questList[i].ClassName);
            if (jsQuestRewardData!=undefined){
                if (jsQuestRewardData['Property']!=undefined && jsQuestRewardData['Property'].length>0){
                    if (propertySum[jsQuestRewardData['Property']] == undefined) propertySum[jsQuestRewardData['Property']] = 0;
                    propertySum[jsQuestRewardData['Property']] = jsQuestRewardData['Value'];
                }
                for (var i=1;i<10;i++){
                    if (jsQuestRewardData['RewardItem'+i]==undefined || jsQuestRewardData['RewardItem'+i].length==0) continue;
                    if (itemSum[jsQuestRewardData['RewardItem'+i]]==undefined) itemSum[jsQuestRewardData['RewardItem'+i]]=0;
                    itemSum[jsQuestRewardData['RewardItem'+i]]+=jsQuestRewardData['RewardCount'+i];
                }
            }
        }

        var output = layout.toString();
        var resultString = '';
        if (targetId > 0){
            resultString += '<table><tbody>';
            for (param in propertySum){
                resultString += '<tr><td>'+tos.ClassName2Lang(serverData,param)+'</td><td>'+propertySum[param].toLocaleString()+'</td></tr>';
            }
            for (param in itemSum){
                resultString += '<tr>';
                resultString += '<td>'+tos.GetItemResultString(serverData, param)+'</td>';
                resultString += '<td>'+itemSum[param].toLocaleString()+'</td>';
                resultString += '</tr>';
            }
            resultString += '</tbody></table>';
            resultString += '<br/>';
            for (param in questList){
                resultString += ' '+tos.GetQuestString(serverData,questList[param].ClassName);
            }
        }

        output = output.replace(/%ResultString%/g, resultString);
        response.send(output);
    });
    return route;
}