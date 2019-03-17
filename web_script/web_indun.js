module.exports = function(app, serverSetting, tableData, scriptData){
    var express = require('express');
    var fs = require('fs');
    //var url = require('url');
    var tos = require('../my_modules/TosModule');
    
    var route = express.Router();
  
    route.get('/', function (request, response) {
      tos.RequestLog(request);
      var indunTable = tableData['indun'];
  
      // id값이 존재하는 경우, 상세 페이지로 이동
      if (indunTable != undefined && request.query.id != undefined && request.query.id != ''){
        for (var i = 0; i < indunTable.length; i ++){
          if (indunTable[i].ClassID === Number(request.query.id)){
            detailPage(i, request, response);
            return;
          }
        }
      }
  
      response.send('no data');
    });
  
    var layout_detail = fs.readFileSync('./web/IndunPage/detail.html');
  
    function detailPage(index, request, response) {
      var indunTable = tableData['indun'];

      var iconname = '';
      if (indunTable[index].MapImage!=undefined && indunTable[index].MapImage.length>0){
        iconname = indunTable[index].MapImage.toLowerCase();
      }
  
      var output = layout_detail.toString();
      output = output.replace(/style.css/g, '../style.css');
      output = output.replace(/%Icon%/g, '<img src="../img/indunmapimage/' + iconname + '.png" />');
      output = output.replace(/%IconPath%/g, 'http://'+request.headers.host+'/img/indunmapimage/' + iconname + '.png');
      output = output.replace(/%Name%/g, indunTable[index].Name);
      output = output.replace(/%ClassName%/g, indunTable[index].ClassName);
      output = output.replace(/%ClassID%/g, indunTable[index].ClassID);
      output = output.replace(/%Category%/g, indunTable[index].Category);
  
      output = output.replace(/%DungeonType%/g, indunTable[index].DungeonType);
      output = output.replace(/%Level%/g, indunTable[index].Level);
      output = output.replace(/%FindType%/g, indunTable[index].FindType);
      output = output.replace(/%PCRank%/g, indunTable[index].PCRank);
      output = output.replace(/%Reward_Silver%/g, indunTable[index].Reward_Silver);
      output = output.replace(/%Reward_Contribution%/g, indunTable[index].Reward_Contribution);
      output = output.replace(/%Reward_Exp%/g, indunTable[index].Reward_Exp);

      output = output.replace(/%Reward_Item%/g, tos.GetItemResultString(tableData,indunTable[index].Reward_Item));
      output = output.replace(/%AdmissionItemName%/g, tos.GetItemResultString(tableData,indunTable[index].AdmissionItemName));

      var indunRewardItem = tos.FindDataClassName(tableData,'indun_reward_item',indunTable[index].ClassName);
      if (indunRewardItem!=undefined){
        var indunRewardItemString = '';
        var itemData = tos.FindDataClassName(tableData,'item',indunRewardItem.Reward_Item);
        indunRewardItemString += '<h3>'+tos.GetItemResultString(tableData,indunRewardItem.Reward_Item)+'</h3>';
        var indunRewardItemList = [];
        if (itemData!=undefined && itemData.StringArg!=undefined){
            for (var j=0;j<tableData['reward_indun'].length;j++){
                if(tableData['reward_indun'][j].Group==itemData.StringArg){
                    indunRewardItemList.push(tableData['reward_indun'][j].ItemName);
                }
            }
        }
        indunRewardItemString += '<div style="margin-left:20px;">';
        for (var j=0;j<indunRewardItemList.length;j++){
            indunRewardItemString += '<p>'+tos.GetItemResultString(tableData,indunRewardItemList[j])+'</p>';
        }
        indunRewardItemString += '</div>';
        output = output.replace(/%IndunRewardItem%/g, indunRewardItemString);
      } else {
        output = output.replace(/%IndunRewardItem%/g, '');
      }

      var startString = '';
      startString += '<p>'+tos.GetMapString(tableData,indunTable[index].StartMap)+'</p>';
      //startString += '<p>'+tos.GetDialogString(tableData,indunTable[index].StartNPCDialog,'Start NPC Dialog')+'</p>';
      var startDialogs = [];
      for (var i=0;i<tableData['dialogtext'].length;i++){
          if (tableData['dialogtext'][i].ClassName.indexOf(indunTable[index].StartNPCDialog+'_')>-1){
            startDialogs.push(tableData['dialogtext'][i].ClassName);
          }
      }
      startString += '<p>';
      for (var i=0;i<startDialogs.length;i++){
        if (i>0) startString += ', ';
        startString += tos.GetDialogString(tableData,startDialogs[i],'Dialog'+(i+1));
      }
      startString += '</p>';
      output = output.replace(/%StartString%/g, startString);

      var minigameString = '';
      minigameString += '<p>'+tos.GetMapString(tableData,indunTable[index].MapName)+'</p>';
      minigameString += '<p>'+tos.GetMinigameString(indunTable[index].MGame)+'</p>';
      output = output.replace(/%MinigameString%/g, minigameString);
      
      if (indunTable[index].UseClearItemName!=undefined && indunTable[index].UseClearItemName.length>0){
          var splited = indunTable[index].UseClearItemName.split(';');
          var clearItemString = '';
          for (var i=0;i<splited.length;i++){
            if (i>0) clearItemString += ', ';
            clearItemString += tos.GetItemResultString(+splited[i].trim());
          }
          output = output.replace(/%UseClearItemName%/g, clearItemString);
      } else {
        output = output.replace(/%UseClearItemName%/g, '');
      }

      var bossString = '';
      if (indunTable[index].BossList!=undefined && indunTable[index].BossList.length>0){
        var splited = indunTable[index].BossList.split('/');
        for (var i=0;i<splited.length;i++){
            bossString += '<p>'+tos.GetMonsterString(tableData,splited[i])+'</p>';
        }
      }
      output = output.replace(/%BossListString%/g, bossString);

      var itemString = '';
      if (indunTable[index].ItemList!=undefined && indunTable[index].ItemList.length>0){
        var splited = indunTable[index].ItemList.split('/');
        for (var i=0;i<splited.length;i++){
            itemString += '<p>'+tos.GetItemResultString(tableData,splited[i])+'</p>';
        }
      }
      output = output.replace(/%ItemListString%/g, itemString);
  
      response.send(output);
    }
  
    return route;
  }