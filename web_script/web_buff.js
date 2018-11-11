module.exports = function(app, tableData, scriptData){
  var express = require('express');
  var fs = require('fs');
  //var url = require('url');
  var tos = require('../my_modules/TosModule');
  
  var route = express.Router();

  var layout = fs.readFileSync('./web/Layout/index-buff.html');
  var layout_topMenu = fs.readFileSync('./web/Layout/topMenu.html');

  route.get('/', function (request, response) {
    var buffTable = tableData['buff'];

    // id값이 존재하는 경우, 상세 페이지로 이동
    if (request.query.id != undefined && request.query.id != ''){
      for (var i = 0; i < buffTable.length; i ++){
        if (buffTable[i].ClassID === Number(request.query.id)){
          buffDetailPage(i, request, response);
          return;
        }
      }
    }

    var filteredTable = [];

    // 필터 - 레벨
    if (request.query.lvFilter != undefined && request.query.lvFilter != ''){
      if (request.query.lvFilter === 'Upper'){
        for (var i = 0; i < buffTable.length; i ++){
          if (Number(buffTable[i].Lv) > 5) continue;
          if (!filteredTable.includes(buffTable[i].ClassName)) filteredTable.push(buffTable[i].ClassName);
        }
      } else {
        for (var i = 0; i < buffTable.length; i ++){
          if (buffTable[i].Lv === request.query.lvFilter) continue;
          if (!filteredTable.includes(buffTable[i].ClassName)) filteredTable.push(buffTable[i].ClassName);
        }
      }
    }

    // 필터 - Group1
    if (request.query.group1Filter != undefined && request.query.group1Filter != ''){
      for (var i = 0; i < buffTable.length; i ++){
        if (buffTable[i].Group1 != undefined && buffTable[i].Group1.toLowerCase() === request.query.group1Filter.toLowerCase()) continue;
        if (!filteredTable.includes(buffTable[i].ClassName)) filteredTable.push(buffTable[i].ClassName);
      }
    }

    // 필터 - Group2
    if (request.query.group2Filter != undefined && request.query.group1Filter != ''){
      for (var i = 0; i < buffTable.length; i ++){
        if (buffTable[i].Group2 != undefined && buffTable[i].Group2.toLowerCase() === request.query.group2Filter.toLowerCase()) continue;
        if (!filteredTable.includes(buffTable[i].ClassName)) filteredTable.push(buffTable[i].ClassName);
      }
    }

    // 필터 - Group3
    if (request.query.group3Filter != undefined && request.query.group3Filter != ''){
      if (request.query.group3Filter === 'None'){
        for (var i = 0; i < buffTable.length; i ++){
          if (buffTable[i].Group3 === undefined || buffTable[i].Group3.length <= 0) continue;
          if (!filteredTable.includes(buffTable[i].ClassName)) filteredTable.push(buffTable[i].ClassName);
        }
      } else {
        for (var i = 0; i < buffTable.length; i ++){
          if (buffTable[i].Group3 != undefined && buffTable[i].Group3.toLowerCase() === request.query.group3Filter.toLowerCase()) continue;
          if (!filteredTable.includes(buffTable[i].ClassName)) filteredTable.push(buffTable[i].ClassName);
        }
      }
    }

    // 필터 - SlotType
    if (request.query.slotTypeFilter != undefined && request.query.slotTypeFilter != ''){
      for (var i = 0; i < buffTable.length; i ++){
        if (buffTable[i].SlotType != undefined && buffTable[i].SlotType.toLowerCase() === request.query.slotTypeFilter.toLowerCase()) continue;
        if (!filteredTable.includes(buffTable[i].ClassName)) filteredTable.push(buffTable[i].ClassName);
      }
    }

    // 필터 - Position
    if (request.query.positionFilter != undefined && request.query.positionFilter != ''){
      for (var i = 0; i < buffTable.length; i ++){
        if (buffTable[i].Position != undefined && buffTable[i].Position.toLowerCase() === request.query.positionFilter.toLowerCase()) continue;
        if (!filteredTable.includes(buffTable[i].ClassName)) filteredTable.push(buffTable[i].ClassName);
      }
    }



    // string query에 검색 데이터가 있는 경우, 검색 결과 가져옴.
    var resultArray = [];
    for (var i = 0; i < buffTable.length; i ++){
      //if (resultArray.length >= 10) break;
      var filter = false;
      for (var j = 0; j < filteredTable.length; j ++){
        if (filteredTable[j] === buffTable[i].ClassName){
          filter = true;
          break;
        }
      }
      if (filter) continue;

      if (request.query.searchType === "Name" && (request.query.searchName === undefined || buffTable[i].Name.indexOf(request.query.searchName) > -1))
        resultArray.push(buffTable[i]);
      else if (request.query.searchType === "ClassName" && (request.query.searchName === undefined || buffTable[i].ClassName.indexOf(request.query.searchName) > -1))
        resultArray.push(buffTable[i]);
      else if (request.query.searchType === "Keyword" && (request.query.searchName === undefined || (buffTable[i].Keyword != undefined && buffTable[i].Keyword.toLowerCase().indexOf(request.query.searchName.toLowerCase()) > -1)))
        resultArray.push(buffTable[i]);
    }
    resultArray.sort(function(a,b){
      if (Number(a.ClassID) > Number(b.ClassID)) return 1;
      else if (Number(a.ClassID) < Number(b.ClassID)) return -1;
      else return 0;
    });

    var resultString = '';
    for (var i = 0; i < resultArray.length; i ++){
      var iconName = resultArray[i].Icon.toLowerCase();
      if (iconName.indexOf('icon_') < 0) iconName = 'icon_' + iconName;
      resultString += '<tr>';
      resultString += '<td align="center"><a href="?id=' + resultArray[i].ClassID + '">' + resultArray[i].ClassID + '</a></td>';
      resultString += '<td align="center"><img src="../img/icon/skillicon/' + iconName  + '.png"/></td>';
      resultString += '<td>';
      resultString +=   '<p>' + resultArray[i].Name + '<br/>' + resultArray[i].ClassName + '<br/>' + '<br/>' + tos.parseCaption(resultArray[i].ToolTip) + '</p>';
      resultString += '</td>';
      resultString += '</tr>';
    }

    var output = layout.toString();
    output = output.replace(/style.css/g, '../Layout/style.css');

    output = output.replace(/%SearchResult%/g, resultString);

    output = output.replace(/%AddTopMenu%/g, layout_topMenu.toString());

    response.send(output);
  });

  var layout_detail = fs.readFileSync('./web/Layout/index-buffdetail.html');

  function buffDetailPage(index, request, response) {
    var buffTable = tableData['buff'];

    var captionScript = '';
    captionScript += '<script>';
    captionScript += '</script>';

    var iconName = buffTable[index].Icon.toLowerCase();
    if (iconName.indexOf('icon_') < 0) iconName = 'icon_' + iconName;

    var output = layout_detail.toString();
    output = output.replace(/style.css/g, '../Layout/style.css');
    output = output.replace(/%Icon%/g, '<img src="../img/icon/skillicon/' + iconName + '.png" />');
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

    output = output.replace(/%Keyword%/g, buffTable[index].Keyword);


    //output = output.replace(/%RawData%/g, JSON.stringify(buffTable[index]));

    output = output.replace(/%AddCaptionScript%/g, captionScript);

    output = output.replace(/%AddTopMenu%/g, layout_topMenu.toString());

    response.send(output);
  }

  return route;
}