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
        if (buffTable[i].ClassID === request.query.id){
          buffDetailPage(i, request, response);
          return;
        }
      }
    }

    var filteredTable = [];


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
    }

    var resultString = '';
    for (var i = 0; i < resultArray.length; i ++){
      var iconPath = resultArray[i].Icon.toLowerCase() + '.png';
      if (iconPath.indexOf('icon_') < 0) iconPath = 'icon_' + iconPath;
      if (fs.existsSync('../img/bufficon/' + iconPath)) iconPath = '../img/bufficon/' + iconPath;
      else if (fs.existsSync('../img/icon/skillicon/' + iconPath)) iconPath = '../img/icon/skillicon/' + iconPath;
      resultString += '<tr>';
      resultString += '<td align="center"><a href="?id=' + resultArray[i].ClassID + '">' + resultArray[i].ClassID + '</a></td>';
      resultString += '<td align="center"><img src="' + iconPath  + '"/></td>';
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

  //var layout_detail = fs.readFileSync('./web/Layout/index-buffdetail.html');

  function buffDetailPage(index, request, response) {
    var buffTable = tableData['buff'];

   

    // var captionScript = '';
    // captionScript += '<script>';

    // captionScript += 'function GetSkillOwner(skill){'
    // captionScript += 'var playerSetting = {';
    // captionScript +=  'Level:Number(1),';
    // captionScript +=  'SR:Number(3),';
    // captionScript +=  'STR:Number(0),';
    // captionScript +=  'CON:Number(0),';
    // captionScript +=  'INT:Number(0),';
    // captionScript +=  'SPR:Number(0),';
    // captionScript +=  'DEX:Number(0),';
    // captionScript += '};';
    // captionScript += 'return playerSetting; }';

    // captionScript += 'function GetAbility(pc, ability){ return undefined; }';
    // captionScript += 'function TryGetProp(data, prop){ return data[prop]; }';
    // captionScript += 'function IsBuffApplied(pc, buff){ return false; }';
    // captionScript += 'function IGetSumOfEquipItem(pc, equip){ return 0; }';
    // captionScript += 'function IsPVPServer(pc){ return 0; }';

    // captionScript += 'var abilLvPrev = Number(0);';
    // captionScript += 'var abilLvNext = Number(1);';

    // captionScript += 'onChangeAbilityLevel();';

    // captionScript += 'function onChangeAbilityLevel(){';
    // captionScript +=  'abilLvPrev = document.getElementById("AbilityLevelPrev").value;';
    // captionScript +=  'abilLvNext = document.getElementById("AbilityLevelNext").value;';
    // captionScript +=  'updateLuaScripts();';
    // captionScript += '}';

    // captionScript += 'function onClickLevelUpPrev(){';
    // captionScript +=  'abilLvPrev ++;';
    // captionScript +=  'if (abilLvPrev > document.getElementById("AbilityLevelPrev").max) abilLvPrev = document.getElementById("AbilityLevelPrev").max;';
    // captionScript +=  'document.getElementById("AbilityLevelPrev").value = abilLvPrev;';
    // captionScript +=  'updateLuaScripts();';
    // captionScript += '}';

    // captionScript += 'function onClickLevelDownPrev(){';
    // captionScript +=  'abilLvPrev --;';
    // captionScript +=  'if (abilLvPrev < document.getElementById("AbilityLevelPrev").min) abilLvPrev = document.getElementById("AbilityLevelPrev").min;';
    // captionScript +=  'document.getElementById("AbilityLevelPrev").value = abilLvPrev;';
    // captionScript +=  'updateLuaScripts();';
    // captionScript += '}';

    // captionScript += 'function onClickLevelUpNext(){';
    // captionScript +=  'abilLvNext ++;';
    // captionScript +=  'if (abilLvNext > document.getElementById("AbilityLevelNext").max) abilLvNext = document.getElementById("AbilityLevelNext").max;';
    // captionScript +=  'document.getElementById("AbilityLevelNext").value = abilLvNext;';
    // captionScript +=  'updateLuaScripts();';
    // captionScript += '}';

    // captionScript += 'function onClickLevelDownNext(){';
    // captionScript +=  'abilLvNext --;';
    // captionScript +=  'if (abilLvNext < document.getElementById("AbilityLevelNext").min) abilLvNext = document.getElementById("AbilityLevelNext").min;';
    // captionScript +=  'document.getElementById("AbilityLevelNext").value = abilLvNext;';
    // captionScript +=  'updateLuaScripts();';
    // captionScript += '}';

    // captionScript += 'function updateLuaScripts(){';
    // if (abilityJob != undefined){
    //   captionScript += 'var price = Number(0);';
    //   captionScript += 'for (var i = Number(abilLvPrev + 1); i <= abilLvNext; i ++){';
    //   captionScript +=  'price+=Number(' + abilityJob.ScrCalcPrice + '(undefined,"' + abilityTable[index].ClassName + '",i,' + abilityJob.MaxLevel + '));';
    //   captionScript += '}';
    //   captionScript += 'if (document.getElementById("PricePoint") != undefined) document.getElementById("PricePoint").innerHTML=price;';
    // }
    // captionScript += '}';

    // if (abilityJob != undefined){
    //   captionScript += tos.Lua2JS(scriptData[abilityJob.ScrCalcPrice]).replace('return price, time', 'return price');
    // }
    
    // captionScript += '</script>';

    
    // var jobsString = '';
    // if (abilityTable[index].Job != undefined){
    //   var splited = abilityTable[index].Job.split(';');
    //   for (var i = 0; i < splited.length; i ++){
    //     jobsString += tos.JobClassNameToJobName(tableData, splited[i]);
    //     if ((i+1) < splited.length) jobsString += ', ';
    //   }
    // }

    // var skillString = '';
    // if (abilityTable[index].SkillCategory != undefined){
    //   for (var i = 0; i < skillTable.length; i ++){
    //     if (skillTable[i].ClassName === abilityTable[index].SkillCategory){
    //       skillString = '<a href="../Skill/?id=' + skillTable[i].ClassID + '">' + skillTable[i].Name + '</a>';
    //       break;
    //     }
    //   }
    // }

    // var spendString = '';
    // if (abilityTable[index].AddSpend != undefined){
    //   var splited = abilityTable[index].AddSpend.split('/');
    //   for (var i = 0; i < splited.length; i += 2) {
    //     if (splited[i] === 'SP'){
    //       spendString += 'SP+';
    //       if ((i + 1) < splited.length) spendString += splited[i+1] + '%';
    //     } else if (splited[i] === 'CoolDown'){
    //       spendString += 'CoolDown';
    //       if ((i + 1) < splited.length) {
    //         if (Number(splited[i+1]) > 0) spendString += '+' + (Number(splited[i+1])/1000) + 'Sec';
    //         else spendString += (Number(splited[i+1])/1000) + 's';
    //       }
    //     }
        
    //     if ((i + 2) < splited.length) spendString += '<br/>';
    //   }
    // }

    // var output = layout_detail.toString();
    // output = output.replace(/style.css/g, '../Layout/style.css');
    // output = output.replace(/%Name%/g, abilityTable[index].Name);
    // output = output.replace(/%ClassName%/g, abilityTable[index].ClassName);
    // output = output.replace(/%ClassID%/g, abilityTable[index].ClassID);
    // output = output.replace(/%SkillCategory%/g, skillString);
    // output = output.replace(/%ActiveState%/g, abilityTable[index].ActiveState);
    // output = output.replace(/%AddSpend%/g, spendString);
    // output = output.replace(/%AlwaysActive%/g, abilityTable[index].AlwaysActive);
    // output = output.replace(/%IsEquipItemAbil%/g, abilityTable[index].IsEquipItemAbil);

    // if (abilityJob === undefined){
    //   output = output.replace(/%MaxLevel%/g, 0);
    //   output = output.replace(/%UnlockDesc%/g, '');
    // } else {
    //   output = output.replace(/%MaxLevel%/g, abilityJob.MaxLevel);
    //   output = output.replace(/%UnlockDesc%/g, abilityJob.UnlockDesc);
    // }

    // output = output.replace(/%Desc%/g, tos.parseCaption(abilityTable[index].Desc));
    // output = output.replace(/%Jobs%/g, jobsString);

    // output = output.replace(/%AddCaptionScript%/g, captionScript);

    // output = output.replace(/%AddTopMenu%/g, layout_topMenu.toString());

    // response.send(output);
  }

  return route;
}