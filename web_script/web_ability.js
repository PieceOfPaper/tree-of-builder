module.exports = function(app, tableData, scriptData){
  var express = require('express');
  var fs = require('fs');
  //var url = require('url');
  var tos = require('../my_modules/TosModule');
  
  var route = express.Router();

  var layout = fs.readFileSync('./web/Layout/index-ability.html');
  var layout_topMenu = fs.readFileSync('./web/Layout/topMenu.html');

  //var search_box = fs.readFileSync('./web/Skill/search_box.html');
  // var jobTable = tableData['job'];
  // var skillTable = tableData['skill'];
  // var skillTreeTable = tableData['skilltree'];

  route.get('/', function (request, response) {
    //var skillTable = tableData['skill'];
    var abilityTable = tableData['ability'];
    //var skillTreeTable = tableData['skilltree'];
    var jobTable = tableData['job'];

    // id값이 존재하는 경우, 상세 페이지로 이동
    if (request.query.id != undefined && request.query.id != ''){
      for (var i = 0; i < abilityTable.length; i ++){
        if (abilityTable[i].ClassID === request.query.id){
          abilityDetailPage(i, request, response);
          return;
        }
      }
    }

    var filteredTable = [];

    // 필터 - 직업
    if (request.query.jobFilter != undefined && request.query.jobFilter != ''){
      if (request.query.jobFilter === 'Unused'){
        for (var i = 0; i < abilityTable.length; i ++){
          if ((abilityTable[i].Job != undefined && abilityTable[i].Job.length > 0) || (abilityTable[i].SkillCategory != undefined && abilityTable[i].SkillCategory.length > 0)) continue;
          if (!filteredTable.includes(abilityTable[i].ClassName)) filteredTable.push(abilityTable[i].ClassName);
        }
      } else if(request.query.jobFilter === 'None') {
        for (var i = 0; i < abilityTable.length; i ++){
          if ((abilityTable[i].Job != undefined && abilityTable[i].Job.length > 0) && (abilityTable[i].SkillCategory === undefined || abilityTable[i].SkillCategory.length <= 0)) continue;
          if (!filteredTable.includes(abilityTable[i].ClassName)) filteredTable.push(abilityTable[i].ClassName);
        }
      } else {
        for (var i = 0; i < abilityTable.length; i ++) {
          if (abilityTable[i].Job != undefined){
            var jobs = abilityTable[i].Job.split(';');
            var isUse = false;
            for (var j = 0; j < jobs.length; j ++){
              if (jobs[j] === undefined) continue;
              if (tos.GetJobNumber1(jobs[j]) === tos.GetJobNumber1(request.query.jobFilter) && tos.GetJobNumber2(jobs[j]) === tos.GetJobNumber2(request.query.jobFilter)){
                isUse = true;
                break;
              }
            }
            if (isUse) continue;
          }
          if (!filteredTable.includes(abilityTable[i].ClassName)) filteredTable.push(abilityTable[i].ClassName);
        }
      }
    }

    // string query에 검색 데이터가 있는 경우, 검색 결과 가져옴.
    var resultArray = [];
    for (var i = 0; i < abilityTable.length; i ++){
      //if (resultArray.length >= 10) break;
      var filter = false;
      for (var j = 0; j < filteredTable.length; j ++){
        if (filteredTable[j] === abilityTable[i].ClassName){
          filter = true;
          break;
        }
      }
      if (filter) continue;

      if (request.query.searchType === "Name" && (request.query.searchName === undefined || abilityTable[i].Name.indexOf(request.query.searchName) > -1))
        resultArray.push(abilityTable[i]);
      else if (request.query.searchType === "ClassName" && (request.query.searchName === undefined || abilityTable[i].ClassName.indexOf(request.query.searchName) > -1))
      resultArray.push(abilityTable[i]);
    }

    var resultString = '';
    for (var i = 0; i < resultArray.length; i ++){
      resultString += '<tr>';
      resultString += '<td align="center"><a href="?id=' + resultArray[i].ClassID + '">' + resultArray[i].ClassID + '</a></td>';
      resultString += '<td align="center"><img src="../img/icon/skillicon/' + resultArray[i].Icon.toLowerCase()  + '.png"/></td>';
      resultString += '<td>';
      resultString +=   '<p>' + resultArray[i].Name + '<br/>' + resultArray[i].ClassName + '<br/>' + '<br/>' + tos.parseCaption(resultArray[i].Desc) + '</p>';
      resultString += '</td>';
      resultString += '</tr>';
    }

    var jobFilterString = '';
    jobFilterString += '<option value="">Job</option>';
    jobFilterString += '<option value="Unused">Unused</option>';
    jobFilterString += '<option value="None">None</option>';
    for (var i = 0; i < jobTable.length; i ++){
      if (jobTable[i].Name != undefined && jobTable[i].Name.length > 0){
        jobFilterString += '<option value="' + jobTable[i].ClassName + '">' + jobTable[i].Name + '</option>';
      } else if (jobTable[i].ClassName != undefined && jobTable[i].ClassName.length > 0){
        jobFilterString += '<option value="' + jobTable[i].ClassName + '">' + jobTable[i].ClassName + '</option>';
      }
    }


    var output = layout.toString();
    output = output.replace(/style.css/g, '../Layout/style.css');

    output = output.replace(/%JobFilter%/g, jobFilterString);

    output = output.replace(/%SearchResult%/g, resultString);

    output = output.replace(/%AddTopMenu%/g, layout_topMenu.toString());

    response.send(output);
    //console.log(request.query.searchType + " " + request.query.searchName);
  });

  var layout_detail = fs.readFileSync('./web/Layout/index-abilitydetail.html');

  function abilityDetailPage(index, request, response) {
    var skillTable = tableData['skill'];
    var abilityTable = tableData['ability'];
    var skillTreeTable = tableData['skilltree'];
    var jobTable = tableData['job'];

    var abilityJob;
    for (var i = 0; i < tableData['ability_job'].length; i ++){
      if (tableData['ability_job'][i].ClassName === abilityTable[index].ClassName){
        abilityJob = tableData['ability_job'][i];
        break;
      }
    }

    var skillMaxLevel = 1;
    for (var i = 0; i < skillTreeTable.length; i ++){
      if (skillTreeTable[i].SkillName == abilityTable[index].ClassName){
        skillMaxLevel = skillTreeTable[i].MaxLevel;
        break;
      }
    }

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

    captionScript += 'var currentAbility = {';
    captionScript +=  'Level: Number(1),';
    captionScript += '};';

    captionScript += 'document.getElementById("AbilityLevel").max=' + skillMaxLevel + ';';
    captionScript += 'onChangeAbilityLevel();';

    captionScript += 'function onChangeAbilityLevel(){';
    captionScript +=  'currentAbility.Level = document.getElementById("AbilityLevel").value;';
    captionScript +=  'updateLuaScripts();';
    captionScript += '}';

    captionScript += 'function onClickLevelUp(){';
    captionScript +=  'currentAbility.Level ++;';
    captionScript +=  'if (currentAbility.Level > document.getElementById("AbilityLevel").max) currentAbility.Level = document.getElementById("AbilityLevel").max;';
    captionScript +=  'document.getElementById("AbilityLevel").value = currentAbility.Level;';
    captionScript +=  'updateLuaScripts();';
    captionScript += '}';

    captionScript += 'function onClickLevelDown(){';
    captionScript +=  'currentAbility.Level --;';
    captionScript +=  'if (currentAbility.Level < document.getElementById("AbilityLevel").min) currentAbility.Level = document.getElementById("AbilityLevel").min;';
    captionScript +=  'document.getElementById("AbilityLevel").value = currentAbility.Level;';
    captionScript +=  'updateLuaScripts();';
    captionScript += '}';

    captionScript += 'function updateLuaScripts(){';
    captionScript += '}';

    // captionScript += tos.Lua2JS(scriptData[skillTable[index].SkillFactor]);
    // captionScript += tos.Lua2JS(scriptData[skillTable[index].SkillSR]);
    // captionScript += tos.Lua2JS(scriptData[skillTable[index].CaptionTime]);
    // captionScript += tos.Lua2JS(scriptData[skillTable[index].CaptionRatio]);
    // captionScript += tos.Lua2JS(scriptData[skillTable[index].CaptionRatio2]);
    // captionScript += tos.Lua2JS(scriptData[skillTable[index].CaptionRatio3]);
    // captionScript += tos.Lua2JS(scriptData[skillTable[index].SpendItemCount]);

    // captionScript += tos.Lua2JS(scriptData['SCR_ABIL_ADD_SKILLFACTOR']);
    // captionScript += tos.Lua2JS(scriptData['SCR_ABIL_ADD_SKILLFACTOR_TOOLTIP']);
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
    output = output.replace(/%Name%/g, abilityTable[index].Name);
    output = output.replace(/%ClassName%/g, abilityTable[index].ClassName);
    output = output.replace(/%ClassID%/g, abilityTable[index].ClassID);
    output = output.replace(/%SkillCategory%/g, skillString);
    output = output.replace(/%ActiveState%/g, abilityTable[index].ActiveState);
    output = output.replace(/%AddSpend%/g, spendString);
    output = output.replace(/%AlwaysActive%/g, abilityTable[index].AlwaysActive);
    output = output.replace(/%IsEquipItemAbil%/g, abilityTable[index].IsEquipItemAbil);

    output = output.replace(/%Desc%/g, tos.parseCaption(abilityTable[index].Desc));
    output = output.replace(/%Jobs%/g, jobsString);

    output = output.replace(/%AddCaptionScript%/g, captionScript);

    output = output.replace(/%AddTopMenu%/g, layout_topMenu.toString());

    response.send(output);
  }

  return route;
}