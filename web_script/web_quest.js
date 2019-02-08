module.exports = function(app, tableData, scriptData){
    var express = require('express');
    var fs = require('fs');
    //var url = require('url');
    var tos = require('../my_modules/TosModule');
    
    var route = express.Router();
  
    route.get('/', function (request, response) {
      tos.RequestLog(request);
        var questTable = tableData['questprogresscheck'];

        // id값이 존재하는 경우, 상세 페이지로 이동
        if (questTable != undefined && request.query.id != undefined && request.query.id != ''){
          for (var i = 0; i < questTable.length; i ++){
            if (questTable[i].ClassID === Number(request.query.id)){
                monsterDetailPage(i, request, response);
              return;
            }
          }
        }

        response.send('no data');
    });
  

    var layout_detail = fs.readFileSync('./web/QuestPage/detail.html');
    function monsterDetailPage(index, request, response) {
        var className = tableData['questprogresscheck'][index].ClassName;
        var questData = tos.FindDataClassName(tableData, 'questprogresscheck', className);
        var questAutoData = tos.FindDataClassName(tableData, 'questprogresscheck_auto', className);

        var nextQuestString = '-';
        if (questAutoData.Success_NextQuestName1 != undefined && questAutoData.Success_NextQuestName1.length > 0){
          var nextQuestData = tos.FindDataClassName(tableData, 'questprogresscheck', questAutoData.Success_NextQuestName1);
          if (nextQuestData != undefined){
            nextQuestString = '<p><a href="?id=' + nextQuestData.ClassID + '">' + nextQuestData.Name + '</a></p>';
          }
        }

        var requireQuestString = '<p>';
        for (var i=1;i<=4;i++){
          if (questData['QuestName'+i] == undefined || questData['QuestName'+i].length == 0) continue;
          if (i > 1) requireQuestString += questData.Quest_Condition + ' ';
          var reqQuestData = tos.FindDataClassName(tableData, 'questprogresscheck', questData['QuestName'+i]);
          requireQuestString += '<a href="?id=' + reqQuestData.ClassID + '">' + reqQuestData.Name + '</a> ';
        }
        requireQuestString += '</p>';

        var rewardString = '';
        if (questAutoData != undefined){
          if (questAutoData.Success_Exp != undefined && questAutoData.Success_Exp > 0){
            rewardString += '<p>EXP ' + questAutoData.Success_Exp + '</p>';
          }
          if (questAutoData.Success_StatByBonus != undefined && questAutoData.Success_StatByBonus > 0){
            rewardString += '<p>Bonus Stat ' + questAutoData.Success_StatByBonus + '</p>';
          }
          if (questAutoData['Success_ItemName' + 1] != undefined && questAutoData['Success_ItemName' + 1].length > 0){
            rewardString += '<h3>Default Reward</h3>';
            for(var i=1;i<=4;i++){
              if (questAutoData['Success_ItemName' + i] == undefined) continue;
              if (questAutoData['Success_ItemCount' + i] == undefined || questAutoData['Success_ItemCount' + i] == 0) continue;
              var itemData = undefined;
              if (itemData == undefined) itemData=tos.FindDataClassName(tableData,'item',questAutoData['Success_ItemName' + i]);
              if (itemData == undefined) itemData=tos.FindDataClassName(tableData,'item_Equip',questAutoData['Success_ItemName' + i]);
              if (itemData == undefined) itemData=tos.FindDataClassName(tableData,'item_Quest',questAutoData['Success_ItemName' + i]);
              if (itemData == undefined) itemData=tos.FindDataClassName(tableData,'item_gem',questAutoData['Success_ItemName' + i]);
              if (itemData == undefined) itemData=tos.FindDataClassName(tableData,'item_premium',questAutoData['Success_ItemName' + i]);
              if (itemData == undefined) itemData=tos.FindDataClassName(tableData,'item_recipe',questAutoData['Success_ItemName' + i]);
              if (itemData != undefined){
                var materialIcon = '<p>';
                if (itemData.EqpType != undefined && itemData.UseGender != undefined && 
                  itemData.EqpType.toLowerCase() == 'outer' && itemData.UseGender.toLowerCase() == 'both'){
                    materialIcon = '<img class="item-material-icon" src="../img/icon/itemicon/' + itemData.Icon.toLowerCase()  + '_m.png"/><img src="../img/icon/itemicon/' + itemData.Icon.toLowerCase()  + '_f.png"/>';
                } else if(itemData.EquipXpGroup != undefined && itemData.EquipXpGroup.toLowerCase() == 'gem_skill') {
                  materialIcon = '<img class="item-material-icon" src="../img/icon/mongem/' + itemData.TooltipImage.toLowerCase()  + '.png"/>';
                } else if(itemData.Icon != undefined){
                  materialIcon = '<img class="item-material-icon" src="../img/icon/itemicon/' + itemData.Icon.toLowerCase()  + '.png"/>';
                } else if(itemData.Illust != undefined){
                  materialIcon = '<img class="item-material-icon" src="../img/icon/itemicon/' + itemData.Illust.toLowerCase()  + '.png"/>';
                }
                rewardString += '<a href="../Item?table=' + itemData.TableName + '&id=' + itemData.ClassID + '">' + materialIcon + ' ' + itemData.Name + '</a>';
                rewardString += ' x' + questAutoData['Success_ItemCount' + i] + '</p>';
              }
            }
          }
          if (questAutoData['Success_SelectItemName' + 1] != undefined && questAutoData['Success_SelectItemName' + 1].length > 0){
            rewardString += '<h3>Select Reward</h3>';
            for(var i=1;i<=4;i++){
              if (questAutoData['Success_SelectItemName' + i] == undefined) continue;
              if (questAutoData['Success_SelectItemCount' + i] == undefined || questAutoData['Success_SelectItemCount' + i] == 0) continue;
              var itemData = undefined;
              if (itemData == undefined) itemData=tos.FindDataClassName(tableData,'item',questAutoData['Success_SelectItemName' + i]);
              if (itemData == undefined) itemData=tos.FindDataClassName(tableData,'item_Equip',questAutoData['Success_SelectItemName' + i]);
              if (itemData == undefined) itemData=tos.FindDataClassName(tableData,'item_Quest',questAutoData['Success_SelectItemName' + i]);
              if (itemData == undefined) itemData=tos.FindDataClassName(tableData,'item_gem',questAutoData['Success_SelectItemName' + i]);
              if (itemData == undefined) itemData=tos.FindDataClassName(tableData,'item_premium',questAutoData['Success_SelectItemName' + i]);
              if (itemData == undefined) itemData=tos.FindDataClassName(tableData,'item_recipe',questAutoData['Success_SelectItemName' + i]);
              if (itemData != undefined){
                var materialIcon = '<p>';
                if (itemData.EqpType != undefined && itemData.UseGender != undefined && 
                  itemData.EqpType.toLowerCase() == 'outer' && itemData.UseGender.toLowerCase() == 'both'){
                    materialIcon = '<img class="item-material-icon" src="../img/icon/itemicon/' + itemData.Icon.toLowerCase()  + '_m.png"/><img src="../img/icon/itemicon/' + itemData.Icon.toLowerCase()  + '_f.png"/>';
                } else if(itemData.EquipXpGroup != undefined && itemData.EquipXpGroup.toLowerCase() == 'gem_skill') {
                  materialIcon = '<img class="item-material-icon" src="../img/icon/mongem/' + itemData.TooltipImage.toLowerCase()  + '.png"/>';
                } else if(itemData.Icon != undefined){
                  materialIcon = '<img class="item-material-icon" src="../img/icon/itemicon/' + itemData.Icon.toLowerCase()  + '.png"/>';
                } else if(itemData.Illust != undefined){
                  materialIcon = '<img class="item-material-icon" src="../img/icon/itemicon/' + itemData.Illust.toLowerCase()  + '.png"/>';
                }
                rewardString += '<a href="../Item?table=' + itemData.TableName + '&id=' + itemData.ClassID + '">' + materialIcon + ' ' + itemData.Name + '</a>';
                rewardString += ' x' + questAutoData['Success_SelectItemCount' + i] + '</p>';
              }
            }
          }
          if (questAutoData['Success_JobItem_Name' + 1] != undefined && questAutoData['Success_JobItem_Name' + 1].length > 0) {
            rewardString += '<h3>Job Reward</h3>';
            for(var i=1;i<=4;i++){
              if (questAutoData['Success_JobItem_Name' + i] == undefined) continue;
              if (questAutoData['Success_JobItem_Count' + i] == undefined || questAutoData['Success_ItemCount' + i] == 0) continue;
              var itemData = undefined;
              if (itemData == undefined) itemData=tos.FindDataClassName(tableData,'item',questAutoData['Success_JobItem_Name' + i]);
              if (itemData == undefined) itemData=tos.FindDataClassName(tableData,'item_Equip',questAutoData['Success_JobItem_Name' + i]);
              if (itemData == undefined) itemData=tos.FindDataClassName(tableData,'item_Quest',questAutoData['Success_JobItem_Name' + i]);
              if (itemData == undefined) itemData=tos.FindDataClassName(tableData,'item_gem',questAutoData['Success_JobItem_Name' + i]);
              if (itemData == undefined) itemData=tos.FindDataClassName(tableData,'item_premium',questAutoData['Success_JobItem_Name' + i]);
              if (itemData == undefined) itemData=tos.FindDataClassName(tableData,'item_recipe',questAutoData['Success_JobItem_Name' + i]);
              if (itemData != undefined){
                var materialIcon = '<p>';
                if (itemData.EqpType != undefined && itemData.UseGender != undefined && 
                  itemData.EqpType.toLowerCase() == 'outer' && itemData.UseGender.toLowerCase() == 'both'){
                    materialIcon = '<img class="item-material-icon" src="../img/icon/itemicon/' + itemData.Icon.toLowerCase()  + '_m.png"/><img src="../img/icon/itemicon/' + itemData.Icon.toLowerCase()  + '_f.png"/>';
                } else if(itemData.EquipXpGroup != undefined && itemData.EquipXpGroup.toLowerCase() == 'gem_skill') {
                  materialIcon = '<img class="item-material-icon" src="../img/icon/mongem/' + itemData.TooltipImage.toLowerCase()  + '.png"/>';
                } else if(itemData.Icon != undefined){
                  materialIcon = '<img class="item-material-icon" src="../img/icon/itemicon/' + itemData.Icon.toLowerCase()  + '.png"/>';
                } else if(itemData.Illust != undefined){
                  materialIcon = '<img class="item-material-icon" src="../img/icon/itemicon/' + itemData.Illust.toLowerCase()  + '.png"/>';
                }
                rewardString += '<a href="../Item?table=' + itemData.TableName + '&id=' + itemData.ClassID + '">' + materialIcon + ' ' + itemData.Name + '</a>';
                rewardString += ' x' + questAutoData['Success_JobItem_Count' + i] + '</p>';
              }
            }
          }
        }

        var questModeIconPath = '';
        switch(questData.QuestMode){
          case "MAIN":
          questModeIconPath = 'http://'+request.headers.host+'/img/minimap_icons/minimap_1_main.png';
          break;
          case "SUB":
          questModeIconPath = 'http://'+request.headers.host+'/img/minimap_icons/minimap_1_sub.png';
          break;
          case "REPEAT":
          questModeIconPath = 'http://'+request.headers.host+'/img/minimap_icons/minimap_1_repeat.png';
          break;
          case "PARTY":
          questModeIconPath = 'http://'+request.headers.host+'/img/minimap_icons/minimap_1_party.png';
          break;
          case "KEYITEM":
          questModeIconPath = 'http://'+request.headers.host+'/img/minimap_icons/minimap_1_keyquest.png';
          break;
        }

        var possibleString = '';
        if (true){
          //possibleString += '<h2>Start Dialog</h2>';
          if (questAutoData['Possible_SelectDialog1'] != undefined && questAutoData['Possible_SelectDialog1'].length > 0){
            possibleString += '<p>'+tos.GetDialogString(tableData,questAutoData['Possible_SelectDialog1'])+' [ '+questAutoData['Possible_AnswerAgree']+' / '+questAutoData['Possible_AnswerAgree']+' ]</p>';
          }
          for (var i=1;i<=10;i++){
            if (questAutoData['Possible_AgreeDialog'+i] == undefined) continue;
            if (questAutoData['Possible_AgreeDialog'+i].length == 0) continue;
            if (questAutoData['Possible_AgreeDialog'+i].indexOf('Notice') > -1){
              possibleString += '<p> ('+i+') '+questAutoData['Possible_AgreeDialog'+i]+'</p>';
              continue;
            }
            var agreeDialog = tos.GetDialogString(tableData,questAutoData['Possible_AgreeDialog'+i]);
            if (agreeDialog == undefined || agreeDialog.length == 0) continue;
            possibleString += '<p> ('+i+') '+agreeDialog+'</p>';
          }
        }

        var progressString = '';
        if (true){
          //possibleString += '<h2>Start Dialog</h2>';
          if (questAutoData['Progress_StartNPCDialog1'] != undefined && questAutoData['Progress_StartNPCDialog1'].length > 0){
            if (questAutoData['Progress_StartNPCDialog1'].indexOf('Notice') > -1){
              progressString += '<p>'+questAutoData['Progress_StartNPCDialog1']+'</p>';
            } else {
              progressString += '<p>'+tos.GetDialogString(tableData,questAutoData['Progress_StartNPCDialog1'])+'</p>';
            }
          }
          for (var i=1;i<=10;i++){
            if (questAutoData['Progress_Dialog'+i] == undefined) continue;
            if (questAutoData['Progress_Dialog'+i].length == 0) continue;
            if (questAutoData['Progress_Dialog'+i].indexOf('Notice') > -1){
              progressString += '<p> ('+i+') '+questAutoData['Progress_Dialog'+i]+'</p>';
              continue;
            }
            var agreeDialog = tos.GetDialogString(tableData,questAutoData['Progress_Dialog'+i]);
            if (agreeDialog == undefined || agreeDialog.length == 0) continue;
            progressString += '<p> ('+i+') '+agreeDialog+'</p>';
          }
        }

        var endString = '';
        if (true){
          //possibleString += '<h2>Start Dialog</h2>';
          if (questAutoData['Success_StartNPCDialog1'] != undefined && questAutoData['Success_StartNPCDialog1'].length > 0){
            if (questAutoData['Success_StartNPCDialog1'].indexOf('Notice') > -1){
              endString += '<p>'+questAutoData['Success_StartNPCDialog1']+'</p>';
            } else {
              endString += '<p>'+tos.GetDialogString(tableData,questAutoData['Success_StartNPCDialog1'])+'</p>';
            }
          }
          for (var i=1;i<=10;i++){
            if (questAutoData['Success_Dialog'+i] == undefined) continue;
            if (questAutoData['Success_Dialog'+i].length == 0) continue;
            if (questAutoData['Success_Dialog'+i].indexOf('Notice') > -1){
              endString += '<p> ('+i+') '+questAutoData['Success_Dialog'+i]+'</p>';
              continue;
            }
            var agreeDialog = tos.GetDialogString(tableData,questAutoData['Success_Dialog'+i]);
            if (agreeDialog == undefined || agreeDialog.length == 0) continue;
            endString += '<p> ('+i+') '+agreeDialog+'</p>';
          }
        }

        var output = layout_detail.toString();
        output = output.replace(/%Name%/g, questData.Name);
        output = output.replace(/%ClassName%/g, questData.ClassName);
        output = output.replace(/%ClassID%/g, questData.ClassID);

        output = output.replace(/%QuestMode%/g, questData.QuestMode);
        output = output.replace(/%QuestModeIconPath%/g, questModeIconPath);
        output = output.replace(/%Level%/g, questData.Level);
        output = output.replace(/%Lvup%/g, questData.Lvup);

        output = output.replace(/%StartDesc%/g, questData.StartDesc);
        output = output.replace(/%StartStory%/g, questData.StartStory);
        output = output.replace(/%StartMapListUI%/g, questData.StartMapListUI==undefined?'':questData.StartMapListUI);
        output = output.replace(/%StartMap%/g, tos.GetMapString(tableData,questData.StartMap));

        output = output.replace(/%ProgDesc%/g, questData.ProgDesc);
        output = output.replace(/%ProgStory%/g, questData.ProgStory);
        output = output.replace(/%ProgMapListUI%/g, questData.ProgMapListUI==undefined?'':questData.ProgMapListUI);
        output = output.replace(/%ProgMap%/g, tos.GetMapString(tableData,questData.ProgMap));

        output = output.replace(/%EndDesc%/g, questData.EndDesc);
        output = output.replace(/%EndStory%/g, questData.EndStory);
        output = output.replace(/%EndMapListUI%/g, questData.EndMapListUI==undefined?'':questData.EndMapListUI);
        output = output.replace(/%EndMap%/g, tos.GetMapString(tableData,questData.EndMap));


        output = output.replace(/%NextQuestString%/g, nextQuestString);
        output = output.replace(/%RequireQuestString%/g, requireQuestString);

        output = output.replace(/%RewardString%/g, rewardString);

        output = output.replace(/%PossibleDialogString%/g, possibleString);
        output = output.replace(/%ProgressDialogString%/g, progressString);
        output = output.replace(/%EndDialogString%/g, endString);

        //output = output.replace(/%StatScript%/g, statScript);

        response.send(output);
    }
  
    return route;
  }