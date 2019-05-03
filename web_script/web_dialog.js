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
        var dialogTable = serverData['tableData']['dialogtext'];

        // id값이 존재하는 경우, 상세 페이지로 이동
        if (dialogTable !=undefined && request.query.id != undefined && request.query.id != ''){
          for (var i = 0; i < dialogTable.length; i ++){
            if (dialogTable[i].ClassID === Number(request.query.id)){
                dialogDetailPage(i, request, response);
              return;
            }
          }
        }

        response.send('no data');
    });
  

    var layout_detail = fs.readFileSync('./web/DialogPage/detail.html');
    function dialogDetailPage(index, request, response) {
      var dialogData = serverData['tableData']['dialogtext'][index];

      var textString = dialogData['Text'];
      if (textString != undefined){
        textString = textString.replace(/{nl}/g,'<br>');
        textString = textString.replace(/{np}/g,'<br><p style="width:calc(100% - 20px); text-align:center;">◆◆◆</p><br>');
      } else {
        textString = '';
      }

      var imgString = '';
      var imgPath = '';
      if (dialogData['ImgName'] != undefined){
        var imgPathData = serverData['imagePath'][dialogData['ImgName'].toLowerCase()];
        if (imgPathData != undefined){
          //imgString += '<img style="max-width:calc(100% - 20px);" src="'+imgPathData.path+'" />';
          imgString = tos.ImagePathToHTML(imgPathData);
          imgPath = imgPathData.path;
        }
      }

      var output = layout_detail.toString();
      output = output.replace(/style.css/g, '../style.css');
      output = output.replace(/%ClassName%/g, dialogData.ClassName);
      output = output.replace(/%ClassID%/g, dialogData.ClassID);
      output = output.replace(/%Caption%/g, dialogData.Caption);
      output = output.replace(/%Image%/g, imgString);
      output = output.replace(/%ImagePath%/g, imgPath);
      output = output.replace(/%Text%/g, textString);


      var connection = new mysqls(serverSetting['dbconfig']);
      var comment_results = connection.query('SELECT * FROM comment WHERE state=0 AND page="Dialog" AND page_arg1="'+''+'" AND page_arg2='+request.query.id+' ORDER BY time DESC;');
      if (comment_results != undefined){
        for (param in comment_results){
          var nickname_results = connection.query('SELECT * FROM user WHERE userno="'+comment_results[param].userno+'";');
          if (nickname_results!=undefined && nickname_results.length>0){
            comment_results[param]["nickname"]=nickname_results[0].nickname;
          }
        }
      }
      if (request.session.login_userno == undefined){
        output = output.replace(/%Comment%/g, dbLayout.Layout_Comment(undefined,'Dialog','',request.query.id,comment_results));
      } else {
        var user_results = connection.query('SELECT * FROM user WHERE userno="'+request.session.login_userno+'";');
        output = output.replace(/%Comment%/g, dbLayout.Layout_Comment(user_results[0],'Dialog','',request.query.id,comment_results));
      }


      response.send(output);
    }
  
    return route;
  }