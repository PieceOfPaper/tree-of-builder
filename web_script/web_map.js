module.exports = function(app, serverSetting, tableData, scriptData){
    var express = require('express');
    var fs = require('fs');
    //var url = require('url');
    var tos = require('../my_modules/TosModule');
    
    var route = express.Router();
  
    var layout_worldmap = fs.readFileSync('./web/MapPage/worldmap.html');
    route.get('/', function (request, response) {
      tos.RequestLog(request);
        var mapTable = tableData['map2'];

        // id값이 존재하는 경우, 상세 페이지로 이동
        if (request.query.id != undefined && request.query.id != ''){
          for (var i = 0; i < mapTable.length; i ++){
            if (mapTable[i].ClassID === Number(request.query.id)){
                mapDetailPage(i, request, response);
              return;
            }
          }
        }

        var output = layout_worldmap.toString();
        response.send(output);
    });
  

    var layout_detail = fs.readFileSync('./web/MapPage/detail.html');
    function mapDetailPage(index, request, response) {
      var mapTable = tableData['map2'];
      var mapData = mapTable[index];

      var dropItemString = '';
      var hasDropItem = false;
      for (var i=1;i<=10;i++){
        if(mapData['DropItemClassName'+i] == undefined || mapData['DropItemClassName'+i].length == 0) continue;
        dropItemString += tos.GetItemResultString(tableData,mapData['DropItemClassName'+i]);
        hasDropItem = true;
      }
      if (hasDropItem) dropItemString = '<h3>Drop Items</h3>' + dropItemString;

      var questString = '';
      var hasQuest = false;
      for (param in tableData['questprogresscheck']){
        if (tableData['questprogresscheck'][param]==undefined) continue;
        if (tableData['questprogresscheck'][param].StartMap==undefined) continue;
        if (tableData['questprogresscheck'][param].StartMap!=mapTable[index].ClassName) continue;
        questString += '<p><a href="../Quest?id='+tableData['questprogresscheck'][param].ClassID+'">'+tos.GetQuestModeImgString(tableData,tableData['questprogresscheck'][param].ClassName)+tableData['questprogresscheck'][param].Name+'</a></p>';
        hasQuest = true;
      }
      if (hasQuest) questString = '<h3>Quest</h3>' + questString;

      var physicalLinkZoneString = '';
      if (mapData.PhysicalLinkZone != undefined && mapData.PhysicalLinkZone.length>0){
        var splited = mapData.PhysicalLinkZone.split('/');
        physicalLinkZoneString += '<h3>Physical Link Zone</h3>';
        for (param in splited){
          physicalLinkZoneString += '<p>'+tos.GetMapString(tableData,splited[param])+'</p>';
        }
      }

      var canWarp = false;
      var campWarpData = undefined;
      for (param in tableData['camp_warp']){
        if (tableData['camp_warp'][param].Zone == mapData.ClassName){
          campWarpData = tableData['camp_warp'][param];
          break;
        }
      }
      var warpQuestString = '';
      if (campWarpData!=undefined){
        canWarp = true;
        warpQuestString = tos.GetQuestString(tableData,campWarpData.WarpOpenQuest);
      }

      var mongetString = '';
      var genTypeTable = tableData['GenType_'+mapData.ClassName];
      if (genTypeTable != undefined){
        mongetString += '<h3>Objects</h3>';
        for (param in genTypeTable){
          if (genTypeTable[param]==undefined) continue;
          mongetString += '<p>';
          if (genTypeTable[param].Name!=undefined && genTypeTable[param].Name.length>0){
            mongetString += genTypeTable[param].Name+' ('+tos.GetMonsterString(tableData,genTypeTable[param].ClassType)+')';
          } else {
            mongetString += tos.GetMonsterString(tableData,genTypeTable[param].ClassType);
          }
          if (genTypeTable[param].Dialog!=undefined && genTypeTable[param].Dialog.length>0){
            //mongetString += ' ' + tos.GetDialogString(tableData,genTypeTable[param].Dialog,'Read Dialog');
            var dialoglist = [];
            for (param2 in tableData['dialogtext']){
              if (tableData['dialogtext'][param2].ClassName==undefined) continue;
              if (tableData['dialogtext'][param2].ClassName.indexOf(genTypeTable[param].Dialog+'_') > -1){
                dialoglist.push(tableData['dialogtext'][param2].ClassName);
              }
            }
            for (var i=0;i<dialoglist.length;i++){
              mongetString += ' ' + tos.GetDialogString(tableData,dialoglist[i],'Dialog'+(i+1));
            }
          }
          mongetString += '</p>';
        }
      }

      var output = layout_detail.toString();

      output = output.replace(/%ClassID%/g, mapData.ClassID);
      output = output.replace(/%ClassName%/g, mapData.ClassName);
      output = output.replace(/%Name%/g, mapData.Name);
      output = output.replace(/%MapRank%/g, mapData.MapRank);
      output = output.replace(/%QuestLevel%/g, mapData.QuestLevel);
      output = output.replace(/%CategoryName%/g, mapData.CategoryName);
      output = output.replace(/%Theme%/g, mapData.Theme);
      output = output.replace(/%Group%/g, mapData.Group);
      output = output.replace(/%MapType%/g, mapData.MapType);
      output = output.replace(/%Grimreaper%/g, mapData.Grimreaper);
      output = output.replace(/%ChallengeMode%/g, mapData.ChallengeMode);
      output = output.replace(/%Journal%/g, mapData.Journal);
      output = output.replace(/%WarpCost%/g, mapData.WarpCost);
      output = output.replace(/%BindCamFarPlane%/g, mapData.BindCamFarPlane);
      output = output.replace(/%RewardEXPBM%/g, mapData.RewardEXPBM);
      output = output.replace(/%MaxHateCount%/g, mapData.MaxHateCount);
      output = output.replace(/%SearchRange%/g, mapData.SearchRange);
      output = output.replace(/%ChaseRange%/g, mapData.ChaseRange);
      output = output.replace(/%BornRange%/g, mapData.BornRange);
      output = output.replace(/%isVillage%/g, mapData.isVillage);
      output = output.replace(/%CanWarp%/g, canWarp?'TRUE':'FALSE');
      output = output.replace(/%WarpQuest%/g, warpQuestString);

      output = output.replace(/%MapRatingRewardItem1%/g, tos.GetItemResultString(tableData,mapData.MapRatingRewardItem1));

      output = output.replace(/%PhysicalLinkZoneString%/g, physicalLinkZoneString);
      output = output.replace(/%DropItemString%/g, dropItemString);
      output = output.replace(/%QuestString%/g, questString);
      output = output.replace(/%MongenString%/g, mongetString);

      response.send(output);
    }
  
    return route;
  }