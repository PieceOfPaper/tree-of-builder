module.exports = function(app, tableData, scriptData){
  var express = require('express');
  var fs = require('fs');
  //var url = require('url');
  var tos = require('../my_modules/TosModule');
  
  var route = express.Router();

  var layout = fs.readFileSync('./web/Layout/index-skill.html');
  var layout_topMenu = fs.readFileSync('./web/Layout/topMenu.html');

  //var search_box = fs.readFileSync('./web/Skill/search_box.html');
  // var jobTable = tableData['job'];
  // var skillTable = tableData['skill'];
  // var skillTreeTable = tableData['skilltree'];

  route.get('/', function (request, response) {
    var skillTable = tableData['skill'];
    var skillTreeTable = tableData['skilltree'];
    var jobTable = tableData['job'];
    var skillAttributeTable = tableData['skill_attribute'];
    var skillSimonyTable = tableData['skill_Simony'];
    var stanceTable = tableData['stance'];

    // id값이 존재하는 경우, 상세 페이지로 이동
    if (request.query.id != undefined && request.query.id != ''){
      for (var i = 0; i < skillTable.length; i ++){
        if (skillTable[i].ClassID === request.query.id){
          skillDetailPage(i, request, response);
          return;
        }
      }
    }

    var filteredTable = [];

    // 필터 - 직업
    if (request.query.jobFilter != undefined && request.query.jobFilter != ''){
      if (request.query.jobFilter === 'Unused'){
        for (var i = 0; i < skillTable.length; i ++){
          var isUse = false;
          for (var j = 0; j < skillTreeTable.length; j ++){
            if (skillTreeTable[j].SkillName === skillTable[i].ClassName){
              isUse = true;
              break;
            }
          }
          if (!isUse) continue;
          if (!filteredTable.includes(skillTable[i].ClassName)) filteredTable.push(skillTable[i].ClassName);
        }
      } else {
        for (var i = 0; i < skillTable.length; i ++){
          var isUse = false;
          for (var j = 0; j < skillTreeTable.length; j ++){
            if (skillTreeTable[j].SkillName === skillTable[i].ClassName){
              isUse = true;
              break;
            }
          }
          if (isUse) continue;
          if (!filteredTable.includes(skillTable[i].ClassName)) filteredTable.push(skillTable[i].ClassName);
        }
        for (var i = 0; i < skillTreeTable.length; i ++){
          if (tos.GetJobNumber2(request.query.jobFilter) > 0){
            if (tos.GetJobNumber1(skillTreeTable[i].ClassName) === tos.GetJobNumber1(request.query.jobFilter) &&
              tos.GetJobNumber2(skillTreeTable[i].ClassName) === tos.GetJobNumber2(request.query.jobFilter))
              continue;
          } else {
            if (tos.GetJobNumber1(skillTreeTable[i].ClassName) === tos.GetJobNumber1(request.query.jobFilter))
              continue;
          }
          if (!filteredTable.includes(skillTreeTable[i].SkillName)) filteredTable.push(skillTreeTable[i].SkillName);
        }
      }
    }

    // 필터 - ClassType
    if (request.query.classTypeFilter != undefined && request.query.classTypeFilter != ''){
      if (request.query.attributeFilter === 'None'){
        for (var i = 0; i < skillTable.length; i ++){
          if (skillTable[i].ClassType.length === 0) continue;
          if (!filteredTable.includes(skillTable[i].ClassName)) filteredTable.push(skillTable[i].ClassName);
        }
      } else {
        for (var i = 0; i < skillTable.length; i ++){
          if (skillTable[i].ClassType === request.query.classTypeFilter) continue;
          if (!filteredTable.includes(skillTable[i].ClassName)) filteredTable.push(skillTable[i].ClassName);
        }
      }
    }

    // 필터 - ValueType
    if (request.query.valueTypeFilter != undefined && request.query.valueTypeFilter != ''){
      if (request.query.valueTypeFilter === 'None'){
        for (var i = 0; i < skillTable.length; i ++){
          if (skillTable[i].ValueType.length === 0) continue;
          if (!filteredTable.includes(skillTable[i].ClassName)) filteredTable.push(skillTable[i].ClassName);
        }
      } else {
        for (var i = 0; i < skillTable.length; i ++){
          if (skillTable[i].ValueType === request.query.valueTypeFilter) continue;
          if (!filteredTable.includes(skillTable[i].ClassName)) filteredTable.push(skillTable[i].ClassName);
        }
      }
    }

    // 필터 - 속성(Attribute)
    if (request.query.attributeFilter != undefined && request.query.attributeFilter != ''){
      if (request.query.attributeFilter === 'None'){
        for (var i = 0; i < skillTable.length; i ++){
          var isUse = false;
          for (var j = 0; j < skillAttributeTable.length; j ++){
            if (skillAttributeTable[j].ClassName === skillTable[i].Attribute){
              isUse = true;
              break;
            }
          }
          if (!isUse) continue;
          if (!filteredTable.includes(skillTable[i].ClassName)) filteredTable.push(skillTable[i].ClassName);
        }
      } else {
        for (var i = 0; i < skillTable.length; i ++){
          if (skillTable[i].Attribute === request.query.attributeFilter) continue;
          if (!filteredTable.includes(skillTable[i].ClassName)) filteredTable.push(skillTable[i].ClassName);
        }
      }
    }

    // 필터 - AttackType
    if (request.query.attackTypeFilter != undefined && request.query.attackTypeFilter != ''){
      if (request.query.attackTypeFilter === 'None'){
        for (var i = 0; i < skillTable.length; i ++){
          if (skillTable[i].AttackType.length === 0) continue;
          if (!filteredTable.includes(skillTable[i].ClassName)) filteredTable.push(skillTable[i].ClassName);
        }
      } else {
        for (var i = 0; i < skillTable.length; i ++){
          if (skillTable[i].AttackType === request.query.attackTypeFilter) continue;
          if (!filteredTable.includes(skillTable[i].ClassName)) filteredTable.push(skillTable[i].ClassName);
        }
      }
    }

    // 필터 - HitType
    if (request.query.hitTypeFilter != undefined && request.query.hitTypeFilter != ''){
      if (request.query.hitTypeFilter === 'None'){
        for (var i = 0; i < skillTable.length; i ++){
          if (skillTable[i].HitType.length === 0) continue;
          if (!filteredTable.includes(skillTable[i].ClassName)) filteredTable.push(skillTable[i].ClassName);
        }
      } else {
        for (var i = 0; i < skillTable.length; i ++){
          if (skillTable[i].HitType === request.query.hitTypeFilter) continue;
          if (!filteredTable.includes(skillTable[i].ClassName)) filteredTable.push(skillTable[i].ClassName);
        }
      }
    }

    // 필터 - EnableCompanion
    if (request.query.companionFilter != undefined && request.query.companionFilter != ''){
      if (request.query.companionFilter === 'None'){
        for (var i = 0; i < skillTable.length; i ++){
          if (skillTable[i].EnableCompanion.length === 0) continue;
          if (!filteredTable.includes(skillTable[i].ClassName)) filteredTable.push(skillTable[i].ClassName);
        }
      } else if(request.query.companionFilter === '!None') {
        for (var i = 0; i < skillTable.length; i ++){
          if (skillTable[i].EnableCompanion.length > 0) continue;
          if (!filteredTable.includes(skillTable[i].ClassName)) filteredTable.push(skillTable[i].ClassName);
        }
      } else if(request.query.companionFilter === '!YES') {
        for (var i = 0; i < skillTable.length; i ++){
          if (skillTable[i].EnableCompanion != 'YES') continue;
          if (!filteredTable.includes(skillTable[i].ClassName)) filteredTable.push(skillTable[i].ClassName);
        }
      } else {
        for (var i = 0; i < skillTable.length; i ++){
          if (skillTable[i].EnableCompanion === request.query.companionFilter) continue;
          if (!filteredTable.includes(skillTable[i].ClassName)) filteredTable.push(skillTable[i].ClassName);
        }
      }
    }

    // 필터 - 시모니
    if (request.query.simonyFilter != undefined && request.query.simonyFilter.toLowerCase().indexOf('true') > -1){
      for (var i = 0; i < skillTable.length; i ++){
        var isSimony = false;
        for (var j = 0; j < skillSimonyTable.length; j ++){
          if (skillSimonyTable[j].ClassID === skillTable[i].ClassID){
            isSimony = true;
            break;
          }
        }
        if (isSimony) continue;
        if (!filteredTable.includes(skillTable[i].ClassName)) filteredTable.push(skillTable[i].ClassName);
      }
    }

    // 필터 - 무쿨기
    if (request.query.nocoolFilter != undefined && request.query.nocoolFilter.toLowerCase().indexOf('true') > -1){
      for (var i = 0; i < skillTable.length; i ++){
        if (Number(skillTable[i].BasicCoolDown) == 0) continue;
        if (!filteredTable.includes(skillTable[i].ClassName)) filteredTable.push(skillTable[i].ClassName);
      }
    }

    // string query에 검색 데이터가 있는 경우, 검색 결과 가져옴.
    var resultArray = [];
    for (var i = 0; i < skillTable.length; i ++){
      //if (resultArray.length >= 10) break;
      var filter = false;
      for (var j = 0; j < filteredTable.length; j ++){
        if (filteredTable[j] === skillTable[i].ClassName){
          filter = true;
          break;
        }
      }
      if (filter) continue;

      if (request.query.searchType === "Name" && (request.query.searchName === undefined || skillTable[i].Name.indexOf(request.query.searchName) > -1))
        resultArray.push(skillTable[i]);
      else if (request.query.searchType === "ClassName" && (request.query.searchName === undefined || skillTable[i].ClassName.indexOf(request.query.searchName) > -1))
      resultArray.push(skillTable[i]);
    }

    var resultString = '';
    for (var i = 0; i < resultArray.length; i ++){
      resultString += '<tr>';
      resultString += '<td align="center"><a href="?id=' + resultArray[i].ClassID + '">' + resultArray[i].ClassID + '</a></td>';
      resultString += '<td align="center"><img src="../img/icon/skillicon/icon_' + resultArray[i].Icon.toLowerCase()  + '.png"/></td>';
      resultString += '<td>';
      resultString +=   '<p>' + resultArray[i].Name + '<br/>' + resultArray[i].ClassName + '</p>';
      resultString += '</td>';
      resultString += '</tr>';
    }

    var jobFilterString = '';
    jobFilterString += '<option value="">Job</option>';
    jobFilterString += '<option value="Unused">Unused</option>';
    jobFilterString += '<option value="Char1">' + tos.JobClassNameToJobName(tableData, 'Char1_1') + ' Line</option>';
    jobFilterString += '<option value="Char2">' + tos.JobClassNameToJobName(tableData, 'Char2_1') + ' Line</option>';
    jobFilterString += '<option value="Char3">' + tos.JobClassNameToJobName(tableData, 'Char3_1') + ' Line</option>';
    jobFilterString += '<option value="Char4">' + tos.JobClassNameToJobName(tableData, 'Char4_1') + ' Line</option>';
    for (var i = 0; i < jobTable.length; i ++){
      if (jobTable[i].Name != undefined && jobTable[i].Name.length > 0){
        jobFilterString += '<option value="' + jobTable[i].ClassName + '">' + jobTable[i].Name + '</option>';
      } else if (jobTable[i].ClassName != undefined && jobTable[i].ClassName.length > 0){
        jobFilterString += '<option value="' + jobTable[i].ClassName + '">' + jobTable[i].ClassName + '</option>';
      }
    }

    var classTypeFilterString = '';
    classTypeFilterString += '<option value="">ClassType</option>';
    classTypeFilterString += '<option value="None">None</option>';
    classTypeFilterString += '<option value="Melee">Melee</option>';
    classTypeFilterString += '<option value="Magic">Magic</option>';
    classTypeFilterString += '<option value="Missile">Missile</option>';

    var valueTypeFilterString = '';
    valueTypeFilterString += '<option value="">ValueType</option>';
    valueTypeFilterString += '<option value="None">None</option>';
    valueTypeFilterString += '<option value="Attack">Attack</option>';
    valueTypeFilterString += '<option value="Buff">Buff</option>';

    var attributeFilterString = '';
    attributeFilterString += '<option value="">Attribute</option>';
    attributeFilterString += '<option value="None">None</option>';
    for (var i = 0; i < skillAttributeTable.length; i ++){
      if (skillAttributeTable[i].TextEffectMsg != undefined && skillAttributeTable[i].TextEffectMsg.length > 0){
        attributeFilterString += '<option value="' + skillAttributeTable[i].ClassName + '">' + skillAttributeTable[i].TextEffectMsg + '</option>';
      } else if (skillAttributeTable[i].ClassName != undefined && skillAttributeTable[i].ClassName.length > 0){
        attributeFilterString += '<option value="' + skillAttributeTable[i].ClassName + '">' + skillAttributeTable[i].ClassName + '</option>';
      }
    }

    var attackTypeFilterString = '';
    attackTypeFilterString += '<option value="">AttackType</option>';
    attackTypeFilterString += '<option value="None">None</option>';
    // attackTypeFilterString += '<option value="Aries">Aries</option>';
    // attackTypeFilterString += '<option value="Arrow">Arrow</option>';
    // attackTypeFilterString += '<option value="Cannon">Cannon</option>';
    // attackTypeFilterString += '<option value="Gun">Gun</option>';
    // attackTypeFilterString += '<option value="Holy">Holy</option>';
    // attackTypeFilterString += '<option value="Magic">Magic</option>';
    // attackTypeFilterString += '<option value="Slash">Slash</option>';
    // attackTypeFilterString += '<option value="Strike">Strike</option>';
    for (var i = 0; i < skillAttributeTable.length; i ++){
      if (skillAttributeTable[i].TextEffectMsg != undefined && skillAttributeTable[i].TextEffectMsg.length > 0){
        attackTypeFilterString += '<option value="' + skillAttributeTable[i].ClassName + '">' + skillAttributeTable[i].TextEffectMsg + '</option>';
      } else if (skillAttributeTable[i].ClassName != undefined && skillAttributeTable[i].ClassName.length > 0){
        attackTypeFilterString += '<option value="' + skillAttributeTable[i].ClassName + '">' + skillAttributeTable[i].ClassName + '</option>';
      }
    }

    var hitTypeFilterString = '';
    hitTypeFilterString += '<option value="">HitType</option>';
    hitTypeFilterString += '<option value="None">None</option>';
    hitTypeFilterString += '<option value="Companion">Companion</option>';
    hitTypeFilterString += '<option value="Companion_Flying">Companion_Flying</option>';
    hitTypeFilterString += '<option value="Force">Force</option>';
    hitTypeFilterString += '<option value="Magic">Magic</option>';
    hitTypeFilterString += '<option value="Melee">Melee</option>';
    hitTypeFilterString += '<option value="Pad">Pad</option>';


    var output = layout.toString();
    output = output.replace(/style.css/g, '../Layout/style.css');

    output = output.replace(/%JobFilter%/g, jobFilterString);
    output = output.replace(/%ClassTypeFilter%/g, classTypeFilterString);
    output = output.replace(/%ValueTypeFilter%/g, valueTypeFilterString);
    output = output.replace(/%AttributeFilter%/g, attributeFilterString);
    output = output.replace(/%AttackTypeFilter%/g, attackTypeFilterString);
    output = output.replace(/%HitTypeFilter%/g, hitTypeFilterString);

    output = output.replace(/%SearchResult%/g, resultString);

    output = output.replace(/%AddTopMenu%/g, layout_topMenu.toString());

    response.send(output);
    //console.log(request.query.searchType + " " + request.query.searchName);
  });

  var layout_detail = fs.readFileSync('./web/Layout/index-skilldetail.html');

  function skillDetailPage(index, request, response) {
    var skillTable = tableData['skill'];
    var skillTreeTable = tableData['skilltree'];

    var skillMaxLevel = 1;
    for (var i = 0; i < skillTreeTable.length; i ++){
      if (skillTreeTable[i].SkillName == skillTable[index].ClassName){
        skillMaxLevel = skillTreeTable[i].MaxLevel;
        break;
      }
    }

    var skillAbility = [];
    for (var i = 0; i < tableData['ability'].length; i ++) {
      if (tableData['ability'][i].SkillCategory === skillTable[index].ClassName){
        skillAbility.push(tableData['ability'][i]);
      }
    }
    var skillAbilityJob = [];
    for (var i = 0; i < skillAbility.length; i ++){
      var hasJob = false;
      for (var j = 0; j < tableData['ability_job'].length; j ++){
        if (skillAbility[i].ClassName === tableData['ability_job'][j].ClassName){
          skillAbilityJob.push(tableData['ability_job'][j]);
          hasJob = true;
          break;
        }
      }
      if (!hasJob){
        skillAbilityJob.push(undefined);
      }
    }
    
    var abilityString = '';
    abilityString += '<table>';
    for (var i = 0; i < skillAbility.length; i ++){
      abilityString += '<tr>';
      if (skillAbilityJob[i] === undefined){
        abilityString += '<td></td>';
      } else {
        abilityString += '<td align="center">';
        abilityString +=  '<input type="number" id="Ability_' + skillAbility[i].ClassName + '" min="0" max="' + skillAbilityJob[i].MaxLevel + '" value="0" onchange="onChangeSkillLevel()">';
        abilityString +=  '<div><button onclick="onClickLevelUpAbility_' + skillAbility[i].ClassName + '()">▲</button><button onclick="onClickLevelDownAbility_' + skillAbility[i].ClassName + '()">▼</button></div>';
        abilityString += '</td>';
      }
      abilityString += '<td align="center"><img src="../img/icon/skillicon/' + skillAbility[i].Icon.toLowerCase()  + '.png"/></td>';
      abilityString += '<td>';
      abilityString +=   '<p>' + skillAbility[i].Name + '<br/>' + skillAbility[i].ClassName + '<br/>' + '<br/>' + tos.parseCaption(skillAbility[i].Desc) + '</p>';
      abilityString += '</td>';
      abilityString += '</tr>';
    }
    abilityString += '</table>';

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

    captionScript += 'function GetAbility(pc, ability){';
    captionScript +=  'if(document.getElementById("Ability_" + ability)!=undefined){';
    captionScript +=     'var abilitySetting = {';
    captionScript +=      'Level:Number(document.getElementById("Ability_" + ability).value),';
    captionScript +=    '};';
    captionScript +=    'return abilitySetting;';
    captionScript +=  '}';
    captionScript +=  'return undefined;';
    captionScript += '}';

    captionScript += 'function TryGetProp(data, prop){ return data[prop]; }';
    captionScript += 'function IsBuffApplied(pc, buff){ return false; }';
    captionScript += 'function IGetSumOfEquipItem(pc, equip){ return 0; }';
    captionScript += 'function IsPVPServer(pc){ return 0; }';

    captionScript += 'var currentSkill = {';
    captionScript +=  'Level: Number(1),';
    captionScript +=  'SklFactor:' + Number(skillTable[index].SklFactor) + ',';
    captionScript +=  'SklFactorByLevel:' + Number(skillTable[index].SklFactorByLevel) + ',';
    captionScript +=  'SklSR:' + Number(skillTable[index].SklSR) + ',';
    captionScript +=  'AttackType:"' + skillTable[index].AttackType + '",';
    captionScript +=  'Attribute:"' + skillTable[index].Attribute + '",';
    captionScript +=  'SpendItemBaseCount:"' + skillTable[index].SpendItemBaseCount + '",';
    captionScript += '};';

    captionScript += 'document.getElementById("SkillLevel").max=' + skillMaxLevel + ';';
    captionScript += 'onChangeSkillLevel();';

    captionScript += 'function onChangeSkillLevel(){';
    captionScript +=  'currentSkill.Level = document.getElementById("SkillLevel").value;';
    captionScript +=  'updateLuaScripts();';
    captionScript += '}';

    captionScript += 'function onClickLevelUp(){';
    captionScript +=  'currentSkill.Level ++;';
    captionScript +=  'if (currentSkill.Level > document.getElementById("SkillLevel").max) currentSkill.Level = document.getElementById("SkillLevel").max;';
    captionScript +=  'document.getElementById("SkillLevel").value = currentSkill.Level;';
    captionScript +=  'updateLuaScripts();';
    captionScript += '}';

    captionScript += 'function onClickLevelDown(){';
    captionScript +=  'currentSkill.Level --;';
    captionScript +=  'if (currentSkill.Level < document.getElementById("SkillLevel").min) currentSkill.Level = document.getElementById("SkillLevel").min;';
    captionScript +=  'document.getElementById("SkillLevel").value = currentSkill.Level;';
    captionScript +=  'updateLuaScripts();';
    captionScript += '}';

    captionScript += 'function updateLuaScripts(){';
    captionScript +=  'if (document.getElementById("SkillFactor") != undefined) document.getElementById("SkillFactor").innerHTML=' + skillTable[index].SkillFactor + '(currentSkill);';
    captionScript +=  'if (document.getElementById("SkillSR") != undefined) document.getElementById("SkillSR").innerHTML=' + skillTable[index].SkillSR + '(currentSkill);';
    captionScript +=  'if (document.getElementById("CaptionTime") != undefined) document.getElementById("CaptionTime").innerHTML=' + skillTable[index].CaptionTime + '(currentSkill);';
    captionScript +=  'if (document.getElementById("CaptionRatio") != undefined) document.getElementById("CaptionRatio").innerHTML=' + skillTable[index].CaptionRatio + '(currentSkill);';
    captionScript +=  'if (document.getElementById("CaptionRatio2") != undefined) document.getElementById("CaptionRatio2").innerHTML=' + skillTable[index].CaptionRatio2 + '(currentSkill);';
    captionScript +=  'if (document.getElementById("CaptionRatio3") != undefined) document.getElementById("CaptionRatio3").innerHTML=' + skillTable[index].CaptionRatio3 + '(currentSkill);';
    captionScript +=  'if (document.getElementById("SpendItemCount") != undefined) document.getElementById("SpendItemCount").innerHTML=' + skillTable[index].SpendItemCount + '(currentSkill);';
    captionScript += '}';

    for (var i = 0; i < skillAbility.length; i ++){
      captionScript += 'var Ability_' + skillAbility[i].ClassName + '=Number(0);';

      captionScript += 'function onClickLevelUpAbility_' + skillAbility[i].ClassName + '(){';
      captionScript +=  'Ability_' + skillAbility[i].ClassName + '++;';
      captionScript +=  'if (Ability_' + skillAbility[i].ClassName + ' > document.getElementById("Ability_' + skillAbility[i].ClassName + '").max) Ability_' + skillAbility[i].ClassName + ' = document.getElementById("Ability_' + skillAbility[i].ClassName + '").max;';
      captionScript +=  'document.getElementById("Ability_' + skillAbility[i].ClassName + '").value = Ability_' + skillAbility[i].ClassName + ';';
      captionScript +=  'console.log(Ability_' + skillAbility[i].ClassName + ');';
      captionScript +=  'updateLuaScripts();';
      captionScript += '}';

      captionScript += 'function onClickLevelDownAbility_' + skillAbility[i].ClassName + '(){';
      captionScript +=  'Ability_' + skillAbility[i].ClassName + '--;';
      captionScript +=  'if (Ability_' + skillAbility[i].ClassName + ' < document.getElementById("Ability_' + skillAbility[i].ClassName + '").min) Ability_' + skillAbility[i].ClassName + '= document.getElementById("Ability_' + skillAbility[i].ClassName + '").min;';
      captionScript +=  'document.getElementById("Ability_' + skillAbility[i].ClassName + '").value = Ability_' + skillAbility[i].ClassName + ';';
      captionScript +=  'console.log(Ability_' + skillAbility[i].ClassName + ');';
      captionScript +=  'updateLuaScripts();';
      captionScript += '}';
    }

    captionScript += tos.Lua2JS(scriptData[skillTable[index].SkillFactor]);
    captionScript += tos.Lua2JS(scriptData[skillTable[index].SkillSR]);
    captionScript += tos.Lua2JS(scriptData[skillTable[index].CaptionTime]);
    captionScript += tos.Lua2JS(scriptData[skillTable[index].CaptionRatio]);
    captionScript += tos.Lua2JS(scriptData[skillTable[index].CaptionRatio2]);
    captionScript += tos.Lua2JS(scriptData[skillTable[index].CaptionRatio3]);
    captionScript += tos.Lua2JS(scriptData[skillTable[index].SpendItemCount]);

    captionScript += tos.Lua2JS(scriptData['SCR_ABIL_ADD_SKILLFACTOR']);
    captionScript += tos.Lua2JS(scriptData['SCR_ABIL_ADD_SKILLFACTOR_TOOLTIP']);
    captionScript += '</script>';

    var stanceString = '';
    if (skillTable[index].ReqStance != undefined){
      var splited = skillTable[index].ReqStance.split(';');
      for (var i = 0; i < splited.length; i ++){
        stanceString += tos.StanceToName(tableData, splited[i]);
        if ((i+1) < splited.length) stanceString += ', ';
      }
    }


    var output = layout_detail.toString();
    output = output.replace(/style.css/g, '../Layout/style.css');
    output = output.replace(/%Icon%/g, '<img src="../img/icon/skillicon/icon_' + skillTable[index].Icon + '.png" />');
    output = output.replace(/%Name%/g, skillTable[index].Name);
    output = output.replace(/%EngName%/g, skillTable[index].EngName);
    output = output.replace(/%ClassName%/g, skillTable[index].ClassName);
    output = output.replace(/%ClassID%/g, skillTable[index].ClassID);
    output = output.replace(/%Rank%/g, skillTable[index].Rank);
    output = output.replace(/%JobName%/g, tos.JobToJobName(tableData, skillTable[index].Job));
    output = output.replace(/%ClassType%/g, skillTable[index].ClassType);
    output = output.replace(/%ValueType%/g, skillTable[index].ValueType);
    output = output.replace(/%Attribute%/g, tos.AttributeToName(tableData, skillTable[index].Attribute));
    output = output.replace(/%AttackType%/g, tos.AttributeToName(tableData, skillTable[index].AttackType));
    output = output.replace(/%HitType%/g, skillTable[index].HitType);
    output = output.replace(/%EnableCompanion%/g, skillTable[index].EnableCompanion);
    output = output.replace(/%ReqStance%/g, stanceString);

    output = output.replace(/%SklFactor%/g, Number(skillTable[index].SklFactor));
    output = output.replace(/%SklFactorByLevel%/g, Number(skillTable[index].SklFactorByLevel));
    output = output.replace(/%BasicSP%/g, Number(skillTable[index].BasicSP));
    output = output.replace(/%LvUpSpendSp%/g, Number(skillTable[index].LvUpSpendSp));

    output = output.replace(/%Caption%/g, tos.parseCaption(skillTable[index].Caption));
    output = output.replace(/%Caption2%/g, tos.parseCaption(skillTable[index].Caption2));

    output = output.replace(/%AddAbility%/g, abilityString);

    output = output.replace(/%AddCaptionScript%/g, captionScript);

    output = output.replace(/%AddTopMenu%/g, layout_topMenu.toString());

    response.send(output);
  }

  return route;
}