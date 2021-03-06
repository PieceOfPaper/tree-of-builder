module.exports = function(app, serverSetting, serverData){
  var express = require('express');
  var fs = require('fs');
  //var url = require('url');
  var mysql = require('mysql');
  var mysqls = require('sync-mysql');

  var tos = require('../my_modules/TosModule');
  var dbLayout = require('../my_modules/DBLayoutModule');
  
  var route = express.Router();

  var layout = fs.readFileSync('./web/Layout/index-buff.html');
  var layout_topMenu = fs.readFileSync('./web/Layout/topMenu.html');

  route.get('/', function (request, response) {
    tos.RequestLog(request);
    var buffTable = serverData['tableData']['buff'];

    // id값이 존재하는 경우, 상세 페이지로 이동
    if (buffTable != undefined && request.query.id != undefined && request.query.id != ''){
      for (var i = 0; i < buffTable.length; i ++){
        if (buffTable[i].ClassID === Number(request.query.id)){
          buffDetailPage(i, request, response);
          return;
        }
      }
    }

    response.send(fs.readFileSync('./web/Layout/message.html').toString().replace(/%Message%/g, 'No Data'));
  });

  var layout_detail = fs.readFileSync('./web/Layout/index-buffdetail.html');

  function buffDetailPage(index, request, response) {
    var buffTable = serverData['tableData']['buff'];

    var rawScripts = '';
    for(param in serverData['scriptData']){
      if (param.indexOf(buffTable[index].ClassName)>-1){
        rawScripts += '<tr><td>'+param+'</td></tr><tr><td class="script">'+serverData['scriptData'][param]+'</td></tr>';
      }
    }

    var captionScript = '';
    captionScript += '<script>';
    captionScript += '</script>';

    // var iconName = buffTable[index].Icon.toLowerCase();
    // if (iconName.indexOf('icon_') < 0) iconName = 'icon_' + iconName;

    var output = layout_detail.toString();
    output = output.replace(/style.css/g, '../style.css');
    // output = output.replace(/%Icon%/g, '<img src="../img/icon/skillicon/' + iconName + '.png" />');
    // output = output.replace(/%IconPath%/g, 'http://'+request.headers.host+'/img/icon/skillicon/' + iconName + '.png');
    output = output.replace(/%Icon%/g, tos.ImagePathToHTML(serverData['imagePath']['icon_'+buffTable[index].Icon.toLowerCase()]));
    output = output.replace(/%IconPath%/g, serverData['imagePath']['icon_'+buffTable[index].Icon.toLowerCase()] == undefined ? '' : serverData['imagePath']['icon_'+buffTable[index].Icon.toLowerCase()].path);
    output = output.replace(/%Name%/g, buffTable[index].Name);
    output = output.replace(/%ClassName%/g, buffTable[index].ClassName);
    output = output.replace(/%ClassID%/g, buffTable[index].ClassID);
    output = output.replace(/%ToolTip%/g, tos.parseCaption(buffTable[index].ToolTip));

    output = output.replace(/%Lv%/g, buffTable[index].Lv);
    output = output.replace(/%Group1%/g, buffTable[index].Group1);
    output = output.replace(/%Group2%/g, buffTable[index].Group2);
    output = output.replace(/%Group3%/g, buffTable[index].Group3);
    output = output.replace(/%SlotType%/g, buffTable[index].SlotType);
    output = output.replace(/%Position%/g, buffTable[index].Position);

    if (buffTable[index].Keyword != undefined) {
      output = output.replace(/%Keyword%/g, buffTable[index].Keyword.replace(/;/g,', '));
    } else {
      output = output.replace(/%Keyword%/g, '');
    }

    output = output.replace(/%RawScripts%/g, '<table class="script-details"><tbody>'+rawScripts+'</tbody></table>');


    //output = output.replace(/%RawData%/g, JSON.stringify(buffTable[index]));

    output = output.replace(/%AddCaptionScript%/g, captionScript);

    //output = output.replace(/%AddTopMenu%/g, layout_topMenu.toString());


    if (serverSetting['dbconfig'] == undefined){
      output = output.replace(/%Comment%/g, '');
    } else {
      var connection = new mysqls(serverSetting['dbconfig']);
      var comment_results = connection.query('SELECT * FROM comment WHERE state=0 AND page="Buff" AND page_arg1="'+''+'" AND page_arg2='+request.query.id+' ORDER BY time DESC;');
      if (comment_results != undefined){
        for (param in comment_results){
          var nickname_results = connection.query('SELECT * FROM user WHERE userno="'+comment_results[param].userno+'";');
          if (nickname_results!=undefined && nickname_results.length>0){
            comment_results[param]["nickname"]=nickname_results[0].nickname;
          }
        }
      }
      if (request.session.login_userno == undefined){
        output = output.replace(/%Comment%/g, dbLayout.Layout_Comment(undefined,'Buff','',request.query.id,comment_results));
      } else {
        var user_results = connection.query('SELECT * FROM user WHERE userno="'+request.session.login_userno+'";');
        output = output.replace(/%Comment%/g, dbLayout.Layout_Comment(user_results[0],'Buff','',request.query.id,comment_results));
      }
      connection.dispose();
    }

    response.send(output);
  }

  return route;
}