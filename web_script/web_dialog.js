module.exports = function(app, tableData, scriptData){
    var express = require('express');
    var fs = require('fs');
    //var url = require('url');
    var tos = require('../my_modules/TosModule');
    
    var route = express.Router();
  
    route.get('/', function (request, response) {
        var dialogTable = tableData['dialogtext'];

        // id값이 존재하는 경우, 상세 페이지로 이동
        if (request.query.id != undefined && request.query.id != ''){
          for (var i = 0; i < dialogTable.length; i ++){
            if (dialogTable[i].ClassID === Number(request.query.id)){
                dialogDetailPage(i, request, response);
              return;
            }
          }
        }

        response.send('');
    });
  

    var layout_detail = fs.readFileSync('./web/DialogPage/detail.html');
    function dialogDetailPage(index, request, response) {
      var dialogData = tableData['dialogtext'][index];

      var textString = dialogData['Text'];
      if (textString != undefined){
        textString = textString.replace(/{nl}/g,'<br>');
        textString = textString.replace(/{np}/g,'<br><p style="width:calc(100% - 20px); text-align:center;">◆◆◆</p><br>');
      } else {
        textString = '';
      }

      var imgString = '';
      var imgPath = '';
      if (dialogData['ImgName'] != undefined && dialogData['ImgName'].length > 0){
        imgString += '<img style="max-width:calc(100% - 20px);" src="../img/Dlg_portrait/'+dialogData['ImgName']+'.png" />';
        imgPath = 'http://'+request.headers.host+'../img/Dlg_portrait/'+dialogData['ImgName']+'.png';
      }

      var output = layout_detail.toString();
      output = output.replace(/style.css/g, '../style.css');
      output = output.replace(/%ClassName%/g, dialogData.ClassName);
      output = output.replace(/%ClassID%/g, dialogData.ClassID);
      output = output.replace(/%Caption%/g, dialogData.Caption);
      output = output.replace(/%Image%/g, imgString);
      output = output.replace(/%ImagePath%/g, imgPath);
      output = output.replace(/%Text%/g, textString);
      response.send(output);
    }
  
    return route;
  }