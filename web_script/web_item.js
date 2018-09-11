module.exports = function(app, tableData, scriptData){
  var express = require('express');
  var fs = require('fs');
  //var url = require('url');
  var tos = require('../my_modules/TosModule');
  
  var route = express.Router();

  var layout = fs.readFileSync('./web/Layout/index-item.html');
  var layout_topMenu = fs.readFileSync('./web/Layout/topMenu.html');

  //var search_box = fs.readFileSync('./web/Skill/search_box.html');
  // var jobTable = tableData['job'];
  // var skillTable = tableData['skill'];
  // var skillTreeTable = tableData['skilltree'];

  route.get('/', function (request, response) {
    var itemTable = tableData['item'];
    var itemEquipTable = tableData['item_Equip'];
    var itemPremiumTable = tableData['item_premium'];
    var itemQuestTable = tableData['item_Quest'];
    var itemGemTable = tableData['item_gem'];

    // id값이 존재하는 경우, 상세 페이지로 이동
    if (request.query.id != undefined && request.query.id != ''){
      for (var i = 0; i < abilityTable.length; i ++){
        if (abilityTable[i].ClassID === request.query.id){
          //itemDetailPage(i, request, response);
          return;
        }
      }
    }

    var filteredItemTable = [];
    var filteredItemEquipTable = [];
    var filteredItemPremiumTable = [];
    var filteredItemQuestTable = [];
    var filteredItemGemTable = [];

    var resultArray = [];

    // Item
    for (var i = 0; i < itemTable.length; i ++){
      var filter = false;
      for (var j = 0; j < filteredItemTable.length; j ++){
        if (filteredItemTable[j] === itemTable[i].ClassName){
          filter = true;
          break;
        }
      }
      if (filter) continue;

      if (request.query.searchType === "Name" && (request.query.searchName === undefined || itemTable[i].Name.indexOf(request.query.searchName) > -1))
        resultArray.push(itemTable[i]);
      else if (request.query.searchType === "ClassName" && (request.query.searchName === undefined || itemTable[i].ClassName.indexOf(request.query.searchName) > -1))
      resultArray.push(itemTable[i]);
    }

    // Item Equip
    for (var i = 0; i < itemEquipTable.length; i ++){
      var filter = false;
      for (var j = 0; j < filteredItemEquipTable.length; j ++){
        if (filteredItemEquipTable[j] === itemEquipTable[i].ClassName){
          filter = true;
          break;
        }
      }
      if (filter) continue;

      if (request.query.searchType === "Name" && (request.query.searchName === undefined || itemEquipTable[i].Name.indexOf(request.query.searchName) > -1))
        resultArray.push(itemEquipTable[i]);
      else if (request.query.searchType === "ClassName" && (request.query.searchName === undefined || itemEquipTable[i].ClassName.indexOf(request.query.searchName) > -1))
      resultArray.push(itemEquipTable[i]);
    }

    // Item Premium
    for (var i = 0; i < itemPremiumTable.length; i ++){
      var filter = false;
      for (var j = 0; j < filteredItemPremiumTable.length; j ++){
        if (filteredItemPremiumTable[j] === itemPremiumTable[i].ClassName){
          filter = true;
          break;
        }
      }
      if (filter) continue;

      if (request.query.searchType === "Name" && (request.query.searchName === undefined || itemPremiumTable[i].Name.indexOf(request.query.searchName) > -1))
        resultArray.push(itemPremiumTable[i]);
      else if (request.query.searchType === "ClassName" && (request.query.searchName === undefined || itemPremiumTable[i].ClassName.indexOf(request.query.searchName) > -1))
      resultArray.push(itemPremiumTable[i]);
    }

    // Item Quest
    for (var i = 0; i < itemQuestTable.length; i ++){
      var filter = false;
      for (var j = 0; j < filteredItemQuestTable.length; j ++){
        if (filteredItemQuestTable[j] === itemQuestTable[i].ClassName){
          filter = true;
          break;
        }
      }
      if (filter) continue;

      if (request.query.searchType === "Name" && (request.query.searchName === undefined || itemQuestTable[i].Name.indexOf(request.query.searchName) > -1))
        resultArray.push(itemQuestTable[i]);
      else if (request.query.searchType === "ClassName" && (request.query.searchName === undefined || itemQuestTable[i].ClassName.indexOf(request.query.searchName) > -1))
      resultArray.push(itemQuestTable[i]);
    }

    // Item Gem
    for (var i = 0; i < itemGemTable.length; i ++){
      var filter = false;
      for (var j = 0; j < filteredItemGemTable.length; j ++){
        if (filteredItemGemTable[j] === itemGemTable[i].ClassName){
          filter = true;
          break;
        }
      }
      if (filter) continue;

      if (request.query.searchType === "Name" && (request.query.searchName === undefined || itemGemTable[i].Name.indexOf(request.query.searchName) > -1))
        resultArray.push(itemGemTable[i]);
      else if (request.query.searchType === "ClassName" && (request.query.searchName === undefined || itemGemTable[i].ClassName.indexOf(request.query.searchName) > -1))
      resultArray.push(itemGemTable[i]);
    }

    // 최종 소팅
    resultArray.sort(function(a,b){
      if (Number(a.ClassID) > Number(b.ClassID)) return 1;
      else if (Number(a.ClassID) < Number(b.ClassID)) return -1;
      else return 0;
    });

    var resultString = '';
    for (var i = 0; i < resultArray.length; i ++){
      resultString += '<tr>';
      resultString += '<td align="center"><a href="?id=' + resultArray[i].ClassID + '">' + resultArray[i].ClassID + '</a></td>';
      // 공용 코스튬은 아이콘이 두개
      if (resultArray[i].EqpType != undefined && resultArray[i].UseGender != undefined && 
          resultArray[i].EqpType.toLowerCase() == 'outer' && resultArray[i].UseGender.toLowerCase() == 'both'){
        resultString += '<td align="center"><img src="../img/icon/itemicon/' + resultArray[i].Icon.toLowerCase()  + '_m.png"/><img src="../img/icon/itemicon/' + resultArray[i].Icon.toLowerCase()  + '_f.png"/></td>';
      } else if(resultArray[i].EquipXpGroup != undefined && resultArray[i].EquipXpGroup.toLowerCase() == 'gem_skill') {
        resultString += '<td align="center"><img src="../img/icon/mongem/' + resultArray[i].Icon.toLowerCase()  + '.png"/></td>';
      } else {
        resultString += '<td align="center"><img src="../img/icon/itemicon/' + resultArray[i].Icon.toLowerCase()  + '.png"/></td>';
      }
      resultString += '<td>';
      resultString +=   '<p>' + resultArray[i].Name + '<br/>' + resultArray[i].ClassName + '</p>';
      //resultString +=   '<p>' + resultArray[i].Name + '<br/>' + resultArray[i].ClassName + '<br/>' + '<br/>' + tos.parseCaption(resultArray[i].Desc) + '</p>';
      resultString += '</td>';
      resultString += '</tr>';
    }


    var output = layout.toString();
    output = output.replace(/style.css/g, '../Layout/style.css');

    output = output.replace(/%SearchResult%/g, resultString);

    output = output.replace(/%AddTopMenu%/g, layout_topMenu.toString());

    response.send(output);
  });

  var layout_detail = fs.readFileSync('./web/Layout/index-abilitydetail.html');

  function itemDetailPage(index, request, response) {
    var skillTable = tableData['skill'];
    var abilityTable = tableData['ability'];
    //var skillTreeTable = tableData['skilltree'];
    //var jobTable = tableData['job'];

    var abilityJob;
    for (var i = 0; i < tableData['ability_job'].length; i ++){
      if (tableData['ability_job'][i].ClassName === abilityTable[index].ClassName){
        abilityJob = tableData['ability_job'][i];
        break;
      }
    }

    // var skillMaxLevel = 1;
    // for (var i = 0; i < skillTreeTable.length; i ++){
    //   if (skillTreeTable[i].SkillName == abilityTable[index].ClassName){
    //     skillMaxLevel = skillTreeTable[i].MaxLevel;
    //     break;
    //   }
    // }

    var captionScript = '';
    captionScript += '<script>';

    captionScript += 'function GetSkillOwner(skill){'
    captionScript += 'var playerSetting = {';
    captionScript +=  'Level:Number(1),';
    captionScript +=  'SR:Number(3),';
    captionScript +=  'STR:Number(0),';
    captionScript +=  'CON:Number(0),';
    captionScript +=  'INT:Number(0),';
    captionScript +=  'SPR:Number(0),';
    captionScript +=  'DEX:Number(0),';
    captionScript += '};';
    captionScript += 'return playerSetting; }';

    captionScript += 'function GetAbility(pc, ability){ return undefined; }';
    captionScript += 'function TryGetProp(data, prop){ return data[prop]; }';
    captionScript += 'function IsBuffApplied(pc, buff){ return false; }';
    captionScript += 'function IGetSumOfEquipItem(pc, equip){ return 0; }';
    captionScript += 'function IsPVPServer(pc){ return 0; }';

    captionScript += 'var abilLvPrev = Number(0);';
    captionScript += 'var abilLvNext = Number(1);';

    if (abilityJob != undefined){
      captionScript += 'document.getElementById("AbilityLevelPrev").min=0;';
      captionScript += 'document.getElementById("AbilityLevelPrev").max=' + abilityJob.MaxLevel + ';';
      captionScript += 'document.getElementById("AbilityLevelNext").min=0;';
      captionScript += 'document.getElementById("AbilityLevelNext").max=' + abilityJob.MaxLevel + ';';
    }

    captionScript += 'onChangeAbilityLevel();';

    captionScript += 'function onChangeAbilityLevel(){';
    captionScript +=  'abilLvPrev = document.getElementById("AbilityLevelPrev").value;';
    captionScript +=  'abilLvNext = document.getElementById("AbilityLevelNext").value;';
    captionScript +=  'updateLuaScripts();';
    captionScript += '}';

    captionScript += 'function onClickLevelUpPrev(){';
    captionScript +=  'abilLvPrev ++;';
    captionScript +=  'if (abilLvPrev > document.getElementById("AbilityLevelPrev").max) abilLvPrev = document.getElementById("AbilityLevelPrev").max;';
    captionScript +=  'document.getElementById("AbilityLevelPrev").value = abilLvPrev;';
    captionScript +=  'updateLuaScripts();';
    captionScript += '}';

    captionScript += 'function onClickLevelDownPrev(){';
    captionScript +=  'abilLvPrev --;';
    captionScript +=  'if (abilLvPrev < document.getElementById("AbilityLevelPrev").min) abilLvPrev = document.getElementById("AbilityLevelPrev").min;';
    captionScript +=  'document.getElementById("AbilityLevelPrev").value = abilLvPrev;';
    captionScript +=  'updateLuaScripts();';
    captionScript += '}';

    captionScript += 'function onClickLevelUpNext(){';
    captionScript +=  'abilLvNext ++;';
    captionScript +=  'if (abilLvNext > document.getElementById("AbilityLevelNext").max) abilLvNext = document.getElementById("AbilityLevelNext").max;';
    captionScript +=  'document.getElementById("AbilityLevelNext").value = abilLvNext;';
    captionScript +=  'updateLuaScripts();';
    captionScript += '}';

    captionScript += 'function onClickLevelDownNext(){';
    captionScript +=  'abilLvNext --;';
    captionScript +=  'if (abilLvNext < document.getElementById("AbilityLevelNext").min) abilLvNext = document.getElementById("AbilityLevelNext").min;';
    captionScript +=  'document.getElementById("AbilityLevelNext").value = abilLvNext;';
    captionScript +=  'updateLuaScripts();';
    captionScript += '}';

    captionScript += 'function updateLuaScripts(){';
    if (abilityJob != undefined){
      captionScript += 'var price = Number(0);';
      captionScript += 'for (var i = Number(abilLvPrev + 1); i <= abilLvNext; i ++){';
      captionScript +=  'price+=Number(' + abilityJob.ScrCalcPrice + '(undefined,"' + abilityTable[index].ClassName + '",i,' + abilityJob.MaxLevel + '));';
      captionScript += '}';
      captionScript += 'if (document.getElementById("PricePoint") != undefined) document.getElementById("PricePoint").innerHTML=price;';
    }
    captionScript += '}';

    if (abilityJob != undefined){
      captionScript += tos.Lua2JS(scriptData[abilityJob.ScrCalcPrice]).replace('return price, time', 'return price');
    }
    
    captionScript += '</script>';

    
    var jobsString = '';
    if (abilityTable[index].Job != undefined){
      var splited = abilityTable[index].Job.split(';');
      for (var i = 0; i < splited.length; i ++){
        jobsString += tos.JobClassNameToJobName(tableData, splited[i]);
        if ((i+1) < splited.length) jobsString += ', ';
      }
    }

    var skillString = '';
    if (abilityTable[index].SkillCategory != undefined){
      for (var i = 0; i < skillTable.length; i ++){
        if (skillTable[i].ClassName === abilityTable[index].SkillCategory){
          skillString = '<a href="../Skill/?id=' + skillTable[i].ClassID + '">' + skillTable[i].Name + '</a>';
          break;
        }
      }
    }

    var spendString = '';
    if (abilityTable[index].AddSpend != undefined){
      var splited = abilityTable[index].AddSpend.split('/');
      for (var i = 0; i < splited.length; i += 2) {
        if (splited[i] === 'SP'){
          spendString += 'SP+';
          if ((i + 1) < splited.length) spendString += splited[i+1] + '%';
        } else if (splited[i] === 'CoolDown'){
          spendString += 'CoolDown';
          if ((i + 1) < splited.length) {
            if (Number(splited[i+1]) > 0) spendString += '+' + (Number(splited[i+1])/1000) + 'Sec';
            else spendString += (Number(splited[i+1])/1000) + 's';
          }
        }
        
        if ((i + 2) < splited.length) spendString += '<br/>';
      }
    }

    var output = layout_detail.toString();
    output = output.replace(/style.css/g, '../Layout/style.css');
    output = output.replace(/%Icon%/g, '<img src="../img/icon/skillicon/' + abilityTable[index].Icon + '.png" />');
    output = output.replace(/%Name%/g, abilityTable[index].Name);
    output = output.replace(/%ClassName%/g, abilityTable[index].ClassName);
    output = output.replace(/%ClassID%/g, abilityTable[index].ClassID);
    output = output.replace(/%SkillCategory%/g, skillString);
    output = output.replace(/%ActiveState%/g, abilityTable[index].ActiveState);
    output = output.replace(/%AddSpend%/g, spendString);
    output = output.replace(/%AlwaysActive%/g, abilityTable[index].AlwaysActive);
    output = output.replace(/%IsEquipItemAbil%/g, abilityTable[index].IsEquipItemAbil);

    if (abilityJob === undefined){
      output = output.replace(/%MaxLevel%/g, 0);
      output = output.replace(/%UnlockDesc%/g, '');
    } else {
      output = output.replace(/%MaxLevel%/g, abilityJob.MaxLevel);
      output = output.replace(/%UnlockDesc%/g, abilityJob.UnlockDesc);
    }

    output = output.replace(/%Desc%/g, tos.parseCaption(abilityTable[index].Desc));
    output = output.replace(/%Jobs%/g, jobsString);

    output = output.replace(/%AddCaptionScript%/g, captionScript);

    output = output.replace(/%AddTopMenu%/g, layout_topMenu.toString());

    response.send(output);
  }

  return route;
}