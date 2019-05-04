module.exports = function(app, serverSetting, serverData){
    var express = require('express');
    var fs = require('fs');
    //var url = require('url');
  var mysql = require('mysql');
  var mysqls = require('sync-mysql');

    var tos = require('../my_modules/TosModule');
  var dbLayout = require('../my_modules/DBLayoutModule');
    
    var route = express.Router();
  
    route.get('/', function (request, response) {
      tos.RequestLog(request);
      var indunTable = serverData['tableData']['indun'];
  
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
      var indunTable = serverData['tableData']['indun'];

      var iconpath = '';
      var iconhtml = '';
      if (indunTable[index].MapImage!=undefined){
        imgPathData = serverData['imagePath'][indunTable[index].MapImage.toLowerCase()];
        if (imgPathData!=undefined){
          iconpath = imgPathData.path;
          iconhtml = tos.ImagePathToHTML(imgPathData);
        }
      }
  
      var output = layout_detail.toString();
      output = output.replace(/style.css/g, '../style.css');
      output = output.replace(/%Icon%/g, iconhtml);
      output = output.replace(/%IconPath%/g, iconpath);
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

      output = output.replace(/%Reward_Item%/g, tos.GetItemResultString(serverData,indunTable[index].Reward_Item));
      output = output.replace(/%AdmissionItemName%/g, tos.GetItemResultString(serverData,indunTable[index].AdmissionItemName));

      var indunRewardItem = tos.FindDataClassName(serverData,'indun_reward_item',indunTable[index].ClassName);
      if (indunRewardItem!=undefined){
        var indunRewardItemString = '';
        var itemData = tos.FindDataClassName(serverData,'item',indunRewardItem.Reward_Item);
        indunRewardItemString += '<p>'+tos.GetItemResultString(serverData,indunRewardItem.Reward_Item)+'</p>';
        // var indunRewardItemList = [];
        // if (itemData!=undefined && itemData.StringArg!=undefined){
        //     for (var j=0;j<serverData['tableData']['reward_indun'].length;j++){
        //         if(serverData['tableData']['reward_indun'][j].Group==itemData.StringArg){
        //             indunRewardItemList.push(serverData['tableData']['reward_indun'][j].ItemName);
        //         }
        //     }
        // }
        // indunRewardItemString += '<div style="margin-left:20px;">';
        // for (var j=0;j<indunRewardItemList.length;j++){
        //     indunRewardItemString += '<p>'+tos.GetItemResultString(serverData,indunRewardItemList[j])+'</p>';
        // }
        // indunRewardItemString += '</div>';
        output = output.replace(/%IndunRewardItem%/g, indunRewardItemString);
      } else {
        output = output.replace(/%IndunRewardItem%/g, '');
      }

      var startString = '';
      startString += '<p>'+tos.GetMapString(serverData,indunTable[index].StartMap)+'</p>';
      //startString += '<p>'+tos.GetDialogString(serverData['tableData'],indunTable[index].StartNPCDialog,'Start NPC Dialog')+'</p>';
      var startDialogs = [];
      for (var i=0;i<serverData['tableData']['dialogtext'].length;i++){
          if (serverData['tableData']['dialogtext'][i].ClassName.indexOf(indunTable[index].StartNPCDialog+'_')>-1){
            startDialogs.push(serverData['tableData']['dialogtext'][i].ClassName);
          }
      }
      startString += '<p>';
      for (var i=0;i<startDialogs.length;i++){
        if (i>0) startString += ', ';
        startString += tos.GetDialogString(serverData,startDialogs[i],'Dialog'+(i+1));
      }
      startString += '</p>';
      output = output.replace(/%StartString%/g, startString);

      var minigameString = '';
      minigameString += '<p>'+tos.GetMapString(serverData,indunTable[index].MapName)+'</p>';
      minigameString += '<p>'+tos.GetMinigameString(indunTable[index].MGame)+'</p>';
      output = output.replace(/%MinigameString%/g, minigameString);
      
      if (indunTable[index].UseClearItemName!=undefined && indunTable[index].UseClearItemName.length>0){
          var splited = indunTable[index].UseClearItemName.split(';');
          var clearItemString = '';
          for (var i=0;i<splited.length;i++){
            if (i>0) clearItemString += ', ';
            clearItemString += tos.GetItemResultString(serverData,splited[i].trim());
          }
          output = output.replace(/%UseClearItemName%/g, clearItemString);
      } else {
        output = output.replace(/%UseClearItemName%/g, '');
      }

      var bossString = '';
      if (indunTable[index].BossList!=undefined && indunTable[index].BossList.length>0){
        var splited = indunTable[index].BossList.split('/');
        for (var i=0;i<splited.length;i++){
            bossString += '<p>'+tos.GetMonsterString(serverData,splited[i])+'</p>';
        }
      }
      output = output.replace(/%BossListString%/g, bossString);

      var itemString = '';
      if (indunTable[index].ItemList!=undefined && indunTable[index].ItemList.length>0){
        var splited = indunTable[index].ItemList.split('/');
        for (var i=0;i<splited.length;i++){
            itemString += '<p>'+tos.GetItemResultString(serverData,splited[i])+'</p>';
        }
      }
      output = output.replace(/%ItemListString%/g, itemString);


      var connection = new mysqls(serverSetting['dbconfig']);
      var comment_results = connection.query('SELECT * FROM comment WHERE state=0 AND page="Indun" AND page_arg1="'+''+'" AND page_arg2='+request.query.id+' ORDER BY time DESC;');
      if (comment_results != undefined){
        for (param in comment_results){
          var nickname_results = connection.query('SELECT * FROM user WHERE userno="'+comment_results[param].userno+'";');
          if (nickname_results!=undefined && nickname_results.length>0){
            comment_results[param]["nickname"]=nickname_results[0].nickname;
          }
        }
      }
      if (request.session.login_userno == undefined){
        output = output.replace(/%Comment%/g, dbLayout.Layout_Comment(undefined,'Indun','',request.query.id,comment_results));
      } else {
        var user_results = connection.query('SELECT * FROM user WHERE userno="'+request.session.login_userno+'";');
        output = output.replace(/%Comment%/g, dbLayout.Layout_Comment(user_results[0],'Indun','',request.query.id,comment_results));
      }
  
      response.send(output);
    }
  
    return route;
  }