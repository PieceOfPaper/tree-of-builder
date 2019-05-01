module.exports = function(app, serverSetting, tableData, scriptData, imagePath){
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
      var baseTable = tableData['collection'];
  
      // id값이 존재하는 경우, 상세 페이지로 이동
      if (baseTable != undefined && request.query.id != undefined && request.query.id != ''){
        for (var i = 0; i < baseTable.length; i ++){
          if (baseTable[i].ClassID === Number(request.query.id)){
            detailPage(i, request, response);
            return;
          }
        }
      }
  
      response.send('no data');
    });
  
    var layout_detail = fs.readFileSync('./web/CollectionPage/detail.html');
  
    function detailPage(index, request, response) {
      var baseTable = tableData['collection'];

      var iconPath = 'https://raw.githubusercontent.com/PieceOfPaper/Tree-of-IPF/master/kr/ui.ipf/icon/item/icon_item_box.png';
      var itemData = tos.FindDataClassName(tableData,'item',baseTable[index].ClassName);
      if (itemData!=undefined){
        var imgPathData = imagePath[itemData.Icon.toLowerCase()];
        if (imgPathData != undefined){
          iconPath = imgPathData.path;
        }
      }
      
      var baseItemString = '<h3>Base Item</h3><p>'+tos.GetItemResultString(tableData,baseTable[index].ClassName,imagePath)+'</p>';

      var itemString = '<h3>Items</h3>';
      for (var i=1;i<=9;i++){
          if (baseTable[index]['ItemName_'+i]==undefined) continue;
          if (baseTable[index]['ItemName_'+i].length==0) continue;
          itemString += '<p>'+tos.GetItemResultString(tableData,baseTable[index]['ItemName_'+i], imagePath)+'</p>';
      }

      var rewardString = '<h3>Rewards</h3>';
      if (baseTable[index]['PropList']!=undefined && baseTable[index]['PropList'].length>0){
        var probsplited = baseTable[index]['PropList'].split('/');
        for (var i=0;i<probsplited.length;i+=2){
            rewardString += '<p>'+tos.ClassName2Lang(tableData,probsplited[i])+' +'+probsplited[i+1]+'</p>';
        }
      }
      if (baseTable[index]['AccPropList']!=undefined && baseTable[index]['AccPropList'].length>0){
        var probsplited = baseTable[index]['AccPropList'].split('/');
        for (var i=0;i<probsplited.length;i+=2){
            rewardString += '<p>'+tos.ClassName2Lang(tableData,probsplited[i])+' +'+probsplited[i+1]+'</p>';
        }
      }
      if (baseTable[index]['AccGiveItemList']!=undefined && baseTable[index]['AccGiveItemList'].length>0){
        var probsplited = baseTable[index]['AccGiveItemList'].split('/');
        for (var i=0;i<probsplited.length;i+=2){
            rewardString += '<p>'+tos.GetItemResultString(tableData,probsplited[i],probsplited[i+1], imagePath)+'</p>';
        }
      }
  
      var output = layout_detail.toString();
      output = output.replace(/style.css/g, '../style.css');
      output = output.replace(/%ImagePath%/g, iconPath);
      output = output.replace(/%Name%/g, baseTable[index].Name);
      output = output.replace(/%ClassName%/g, baseTable[index].ClassName);
      output = output.replace(/%ClassID%/g, baseTable[index].ClassID);
      output = output.replace(/%Journal%/g, baseTable[index].Journal);

      output = output.replace(/%BaseItemString%/g, baseItemString);
      output = output.replace(/%ItemString%/g, itemString);
      output = output.replace(/%RewardString%/g, rewardString);


      var connection = new mysqls(serverSetting['dbconfig']);
      var comment_results = connection.query('SELECT * FROM comment WHERE state=0 AND page="Collection" AND page_arg1="'+''+'" AND page_arg2='+request.query.id+' ORDER BY time DESC LIMIT 100;');
      if (comment_results != undefined){
        for (param in comment_results){
          var nickname_results = connection.query('SELECT * FROM user WHERE userno="'+comment_results[param].userno+'";');
          if (nickname_results!=undefined && nickname_results.length>0){
            comment_results[param]["nickname"]=nickname_results[0].nickname;
          }
        }
      }
      if (request.session.login_userno == undefined){
        output = output.replace(/%Comment%/g, dbLayout.Layout_Comment(undefined,'Collection','',request.query.id,comment_results));
      } else {
        var user_results = connection.query('SELECT * FROM user WHERE userno="'+request.session.login_userno+'";');
        output = output.replace(/%Comment%/g, dbLayout.Layout_Comment(user_results[0],'Collection','',request.query.id,comment_results));
      }

      response.send(output);
    }
  
    return route;
  }