module.exports = function(app, serverSetting, serverData){
  var express = require('express');
  var http = require('http');
  var https = require('https');
  var fs = require('fs');
  var mysql = require('mysql');
  var mysqls = require('sync-mysql');

  var csv = require('csv-parser');
  var xml = require('xml-parser');
  
    var tos = require('../my_modules/TosModule');
    var dbLayout = require('../my_modules/DBLayoutModule');
    
    var route = express.Router();
  
    var layout_worldmap = fs.readFileSync('./web/MapPage/worldmap.html');
    route.get('/', function (request, response) {
      tos.RequestLog(request);
        var mapTable = serverData['tableData']['map2'];

        // id값이 존재하는 경우, 상세 페이지로 이동
        if (request.query.id != undefined && request.query.id != ''){
          for (var i = 0; i < mapTable.length; i ++){
            if (mapTable[i].ClassID === Number(request.query.id)){
              // if (serverData['tableData']['GenType_'+mapTable[i].ClassName]!=undefined && serverData['tableData']['GenType_'+mapTable[i].ClassName].length>0){
              //   mapDetailPage(i, request, response);
              // } else {
              //   loadTable('GenType_'+mapTable[i].ClassName, 'ies_mongen.ipf/GenType_'+mapTable[i].ClassName+'.ies', function(){
              //     if (serverData['tableData']['GenType_'+mapTable[i].ClassName]!=undefined && serverData['tableData']['GenType_'+mapTable[i].ClassName].length>0){
              //       mapDetailPage(i, request, response);
              //       return;
              //     }
              //     loadTable('GenType_'+mapTable[i].ClassName, 'ies_mongen.ipf/gentype_'+mapTable[i].ClassName+'.ies', function(){
              //       mapDetailPage(i, request, response);
              //     });
              //   });
              // }
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
      var mapTable = serverData['tableData']['map2'];
      var mapData = mapTable[index];

      var dropItemString = '';
      var hasDropItem = false;
      for (var i=1;i<=10;i++){
        if(mapData['DropItemClassName'+i] == undefined || mapData['DropItemClassName'+i].length == 0) continue;
        dropItemString += tos.GetItemResultString(serverData,mapData['DropItemClassName'+i]);
        hasDropItem = true;
      }
      if (hasDropItem) dropItemString = '<h3>Drop Items</h3>' + dropItemString;

      var questString = '';
      var hasQuest = false;
      for (param in serverData['tableData']['questprogresscheck']){
        if (serverData['tableData']['questprogresscheck'][param]==undefined) continue;
        if (serverData['tableData']['questprogresscheck'][param].StartMap==undefined) continue;
        if (serverData['tableData']['questprogresscheck'][param].StartMap!=mapTable[index].ClassName) continue;
        questString += '<p><a href="../Quest?id='+serverData['tableData']['questprogresscheck'][param].ClassID+'">'+tos.GetQuestModeImgString(serverData,serverData['tableData']['questprogresscheck'][param].ClassName)+serverData['tableData']['questprogresscheck'][param].Name+'</a></p>';
        hasQuest = true;
      }
      if (hasQuest) questString = '<h3>Quest</h3>' + questString;

      var physicalLinkZoneString = '';
      if (mapData.PhysicalLinkZone != undefined && mapData.PhysicalLinkZone.length>0){
        var splited = mapData.PhysicalLinkZone.split('/');
        physicalLinkZoneString += '<h3>Physical Link Zone</h3>';
        for (param in splited){
          physicalLinkZoneString += '<p>'+tos.GetMapString(serverData,splited[param])+'</p>';
        }
      }

      var canWarp = false;
      var campWarpData = undefined;
      for (param in serverData['tableData']['camp_warp']){
        if (serverData['tableData']['camp_warp'][param].Zone == mapData.ClassName){
          campWarpData = serverData['tableData']['camp_warp'][param];
          break;
        }
      }
      var warpQuestString = '';
      if (campWarpData!=undefined){
        canWarp = true;
        warpQuestString = tos.GetQuestString(serverData,campWarpData.WarpOpenQuest);
      }

      var mongetString = '';
      var genTypeTable = serverData['tableData']['GenType_'+mapData.ClassName];
      if (genTypeTable != undefined){
        mongetString += '<h3>Objects</h3>';
        for (param in genTypeTable){
          if (genTypeTable[param]==undefined) continue;
          mongetString += '<p>';
          if (genTypeTable[param].Name!=undefined && genTypeTable[param].Name.length>0){
            mongetString += genTypeTable[param].Name+' ('+tos.GetMonsterString(serverData,genTypeTable[param].ClassType)+')';
          } else {
            mongetString += tos.GetMonsterString(serverData,genTypeTable[param].ClassType);
          }
          if (genTypeTable[param].Dialog!=undefined && genTypeTable[param].Dialog.length>0){
            //mongetString += ' ' + tos.GetDialogString(serverData['tableData'],genTypeTable[param].Dialog,'Read Dialog');
            var dialoglist = [];
            for (param2 in serverData['tableData']['dialogtext']){
              if (serverData['tableData']['dialogtext'][param2].ClassName==undefined) continue;
              if (serverData['tableData']['dialogtext'][param2].ClassName.indexOf(genTypeTable[param].Dialog+'_') > -1){
                dialoglist.push(serverData['tableData']['dialogtext'][param2].ClassName);
              }
            }
            for (var i=0;i<dialoglist.length;i++){
              mongetString += ' ' + tos.GetDialogString(serverData,dialoglist[i],'Dialog'+(i+1));
            }
          }
          mongetString += '</p>';
        }
      }


      var bgmString = '';
      if (mapData['BgmPlayList'] != undefined && mapData['BgmPlayList'].length > 0){
        var playlist = serverData['xmlData']['xml.ipf/playlist'];
        if (playlist != undefined && playlist.root != undefined){
          for (var i=0;i<playlist.root.children.length;i++){
            if (playlist.root.children[i].attributes['PlayListName']==mapData['BgmPlayList']){
              var playlistPaths = [];
              for (var j=1;j<10;j++){
                if (playlist.root.children[i].attributes['FileName'+j]!=undefined){
                  playlistPaths.push(serverSetting['dataServerPath']+serverSetting['serverCode']+'/bgm/'+playlist.root.children[i].attributes['FileName'+j]);
                }
              }
              bgmString += '<script> audioPlayList_setPlayList("map_bgm",'+JSON.stringify(playlistPaths)+');</script>';
              break;
            }
          }
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

      output = output.replace(/%MapRatingRewardItem1%/g, tos.GetItemResultString(serverData,mapData.MapRatingRewardItem1));

      output = output.replace(/%PhysicalLinkZoneString%/g, physicalLinkZoneString);
      output = output.replace(/%DropItemString%/g, dropItemString);
      output = output.replace(/%QuestString%/g, questString);
      output = output.replace(/%MongenString%/g, mongetString);

      output = output.replace(/%BgmPlayList%/g, mapData['BgmPlayList'] == undefined ? '' : mapData['BgmPlayList']);
      output = output.replace(/%BGMString%/g, bgmString);


      if (serverSetting['dbconfig'] == undefined){
        output = output.replace(/%Comment%/g, '');
      } else {
        var connection = new mysqls(serverSetting['dbconfig']);
        var comment_results = connection.query('SELECT * FROM comment WHERE state=0 AND page="Map" AND page_arg1="'+''+'" AND page_arg2='+request.query.id+' ORDER BY time DESC;');
        if (comment_results != undefined){
          for (param in comment_results){
            var nickname_results = connection.query('SELECT * FROM user WHERE userno="'+comment_results[param].userno+'";');
            if (nickname_results!=undefined && nickname_results.length>0){
              comment_results[param]["nickname"]=nickname_results[0].nickname;
            }
          }
        }
        if (request.session.login_userno == undefined){
          output = output.replace(/%Comment%/g, dbLayout.Layout_Comment(undefined,'Map','',request.query.id,comment_results));
        } else {
          var user_results = connection.query('SELECT * FROM user WHERE userno="'+request.session.login_userno+'";');
          output = output.replace(/%Comment%/g, dbLayout.Layout_Comment(user_results[0],'Map','',request.query.id,comment_results));
        }
        connection.dispose();
      }

      response.send(output);
    }

    function loadTable(name, path, callback){
      if (serverData['tableData'][name] === undefined) serverData['tableData'][name] = [];
      var file = fs.createWriteStream('./web/data/' + path);
      //console.log('request download table [' + name + '] ' + path);
      var request = https.get(serverSetting['dataServerPath'] + serverSetting['serverCode'] + '/' + path, function(response) {
        response.pipe(file).on('close', function(){
          console.log('downloaded table [' + name + '] ' + path);
          if (fs.existsSync('./web/data/' + path) == false){
            console.log('not exist table [' + name + '] ' + path);
            if (callback != undefined) callback();
            return;
          }
          fs.createReadStream('./web/data/' + path).pipe(csv()).on('data', function (data) {
            data['TableName'] = name;
            for(var param in data){
              if (data[param] == undefined) continue;
              if (data[param].toLowerCase().indexOf('true') >= 0 || data[param].toLowerCase().indexOf('false') >= 0){
                continue;
              } else if (Number(data[param]).toString() != "NaN" && (Number(data[param]).toString().length == data[param].length  || data[param].indexOf('\.') > 0)){
                data[param] = Number(data[param]);
              }
            }
            serverData['tableData'][name].push(data);
          }).on('end', function(){
            console.log('import table [' + name + ']' + serverData['tableData'][name].length + ' ' + path);
            if (callback != undefined) callback();
          });
        });
      }).on('error', (e) => {
        console.log('download error table [' + name + '] ' + path + ' ' + e);
        if (callback != undefined) callback();
      });
    }
  
    return route;
  }