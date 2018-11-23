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
        if (skillTable[i].ClassID === Number(request.query.id)){
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

    // 필터 - Stance
    if (request.query.stanceFilter != undefined && request.query.stanceFilter.length > 0){
      var filteredStanceList = request.query.stanceFilter.split(';');
      for (var i = 0; i < skillTable.length; i ++){
        var isFiltered = false;
        if (skillTable[i].ReqStance != undefined && skillTable[i].ReqStance.length > 0){
          var skillStanceList = skillTable[i].ReqStance.split(';');
          for (var j = 0; j < skillStanceList.length; j ++){
            isFiltered = false;
            for (var k = 0; k < filteredStanceList.length; k ++){
              if (skillStanceList[j].toLowerCase() === filteredStanceList[k].toLowerCase()){
                isFiltered = true;
                break;
              }
            }
            if (isFiltered == false) break;
          }
        }
        if (isFiltered == false) continue;
        if (!filteredTable.includes(skillTable[i].ClassName)) filteredTable.push(skillTable[i].ClassName);
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

    // 필터 - 시노비 분신
    if (request.query.bunsinFilter != undefined && request.query.bunsinFilter.toLowerCase().indexOf('true') > -1){
      for (var i = 0; i < skillTable.length; i ++){
        if (skillTable[i].CoolDown === 'SCR_GET_SKL_COOLDOWN_BUNSIN') continue;
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
      var resultJob = [];
      for (var j = 0; j < skillTreeTable.length; j ++){
        if (skillTreeTable[j].SkillName == resultArray[i].ClassName) {
          resultJob.push(tos.Skilltree2Job(tableData, skillTreeTable[j].ClassName));
        }
      }
      resultString += '<td align="center">';
      if (resultJob != undefined && resultJob.length > 0) {
        for (var j = 0; j < resultJob.length; j ++){
          resultString += '<img src="../img/icon/classicon/' + resultJob[j].Icon.toLowerCase() + '.png" />';
        }
      } 
      resultString += '</td>';
      resultString += '<td align="center"><img src="../img/icon/skillicon/icon_' + resultArray[i].Icon.toLowerCase()  + '.png"/></td>';
      resultString += '<td>';
      //resultString +=   '<p>' + resultArray[i].Name + '<br/>' + resultArray[i].ClassName + '</p>';
      resultString +=   '<p>' + resultArray[i].Name + '</p>';
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


    var stanceFilterString = '';
    for (var i = 0; i < stanceTable.length; i ++){
      stanceFilterString += '<input type="checkbox" id="stanceFilter_' + stanceTable[i].ClassName + '" checked>' + stanceTable[i].Name + '<br>';
    }

    var output = layout.toString();
    output = output.replace(/style.css/g, '../style.css');

    output = output.replace(/%JobFilter%/g, jobFilterString);
    output = output.replace(/%ClassTypeFilter%/g, classTypeFilterString);
    output = output.replace(/%ValueTypeFilter%/g, valueTypeFilterString);
    output = output.replace(/%AttributeFilter%/g, attributeFilterString);
    output = output.replace(/%AttackTypeFilter%/g, attackTypeFilterString);
    output = output.replace(/%HitTypeFilter%/g, hitTypeFilterString);

    output = output.replace(/%StanceFilter%/g, stanceFilterString);

    output = output.replace(/%SearchResult%/g, resultString);

    //output = output.replace(/%AddTopMenu%/g, layout_topMenu.toString());

    response.send(output);
    //console.log(request.query.searchType + " " + request.query.searchName);
  });

  var layout_detail = fs.readFileSync('./web/Layout/index-skilldetail.html');

  function skillDetailPage(index, request, response) {
    var skillTable = tableData['skill'];
    var skillTreeTable = tableData['skilltree'];
    var cooldownTable = tableData['cooldown'];

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
        abilityString += '<td>Unused</td>';
      } else {
        abilityString += '<td align="center">';
        abilityString +=  '<input type="number" id="Ability_' + skillAbility[i].ClassName + '" min="0" max="' + skillAbilityJob[i].MaxLevel + '" value="0" onchange="onChangeSkillLevel()">';
        abilityString +=  '<div><button onclick="onClickLevelUpAbility_' + skillAbility[i].ClassName + '()">▲</button><button onclick="onClickLevelDownAbility_' + skillAbility[i].ClassName + '()">▼</button></div>';
        abilityString += '</td>';
      }
      abilityString += '<td align="center"><img src="../img/icon/skillicon/' + skillAbility[i].Icon.toLowerCase()  + '.png"/></td>';
      abilityString += '<td>';
      abilityString +=   '<p><a href="../Ability/?id=' + skillAbility[i].ClassID + '">' + skillAbility[i].Name + '</a></p>';
      if (skillAbilityJob[i] !== undefined){
        abilityString +=   '<p>' + skillAbilityJob[i].UnlockDesc + '</p>';
      }
      //abilityString +=   '<br/>';
      abilityString +=   '<p>' + tos.parseCaption(skillAbility[i].Desc) + '</p>';
      abilityString += '</td>';
      abilityString += '</tr>';
    }
    abilityString += '</table>';

    var captionScript = '';
    captionScript += '<script>';

    captionScript += 'function GetSkillOwner(skill){'
    captionScript += 'var playerSetting = {';
    captionScript +=  'Lv:Number(1),';
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
    //captionScript +=    'console.log("GetAbility:"+abilitySetting);'; 
    captionScript +=    'return abilitySetting;';
    captionScript +=  '}';
    captionScript +=  'return undefined;';
    captionScript += '}';

    captionScript += 'function TryGetProp(data, prop, defValue){ ';
    captionScript +=  'if (data[prop] === undefined) {';
    //captionScript +=    'console.log("TryGetProb:null");';
    //captionScript +=    'console.log(data);';
    captionScript +=    'if (defValue != undefined) return defValue;'; 
    captionScript +=    'return 0; }';
    //captionScript +=  'console.log("TryGetProb:"+data[prop]);';
    captionScript +=  'return data[prop];'; 
    captionScript += '}';

    captionScript += 'function IsBuffApplied(pc, buff){ return false; }';
    captionScript += 'function IGetSumOfEquipItem(pc, equip){ return 0; }';
    captionScript += 'function IsPVPServer(pc){ return 0; }';

    captionScript += 'var currentSkill = {';
    captionScript +=  'Level: Number(1),';
    captionScript +=  'SklFactor:' + skillTable[index].SklFactor + ',';
    captionScript +=  'SklFactorByLevel:' + skillTable[index].SklFactorByLevel + ',';
    captionScript +=  'SklSR:' + skillTable[index].SklSR + ',';
    captionScript +=  'AttackType:"' + skillTable[index].AttackType + '",';
    captionScript +=  'Attribute:"' + skillTable[index].Attribute + '",';
    captionScript +=  'SpendItemBaseCount:' + skillTable[index].SpendItemBaseCount + ',';
    captionScript +=  'ReinforceAbility:"' + skillTable[index].ReinforceAbility + '",';
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
    captionScript +=  'var spans=document.getElementsByTagName("span");';
    captionScript +=  'if (spans != undefined) { for (var i=0; i <spans.length; i ++) {';
    captionScript +=    'if (spans[i].id == "SkillFactor") spans[i].innerHTML=' + skillTable[index].SkillFactor + '(currentSkill);';
    captionScript +=    'if (spans[i].id == "SkillSR") spans[i].innerHTML=' + skillTable[index].SkillSR + '(currentSkill);';
    captionScript +=    'if (spans[i].id == "CaptionTime") spans[i].innerHTML=' + skillTable[index].CaptionTime + '(currentSkill);';
    captionScript +=    'if (spans[i].id == "CaptionRatio") spans[i].innerHTML=' + skillTable[index].CaptionRatio + '(currentSkill);';
    captionScript +=    'if (spans[i].id == "CaptionRatio2") spans[i].innerHTML=' + skillTable[index].CaptionRatio2 + '(currentSkill);';
    captionScript +=    'if (spans[i].id == "CaptionRatio3") spans[i].innerHTML=' + skillTable[index].CaptionRatio3 + '(currentSkill);';
    captionScript +=    'if (spans[i].id == "SpendItemCount") spans[i].innerHTML=' + skillTable[index].SpendItemCount + '(currentSkill);';
    captionScript +=  '} } ';
    captionScript += '}';

    for (var i = 0; i < skillAbility.length; i ++){
      captionScript += 'var Ability_' + skillAbility[i].ClassName + '=Number(0);';

      captionScript += 'function onClickLevelUpAbility_' + skillAbility[i].ClassName + '(){';
      captionScript +=  'Ability_' + skillAbility[i].ClassName + '++;';
      captionScript +=  'if (Ability_' + skillAbility[i].ClassName + ' > document.getElementById("Ability_' + skillAbility[i].ClassName + '").max) Ability_' + skillAbility[i].ClassName + ' = document.getElementById("Ability_' + skillAbility[i].ClassName + '").max;';
      captionScript +=  'document.getElementById("Ability_' + skillAbility[i].ClassName + '").value = Ability_' + skillAbility[i].ClassName + ';';
      //captionScript +=  'console.log(Ability_' + skillAbility[i].ClassName + ');';
      captionScript +=  'updateLuaScripts();';
      captionScript += '}';

      captionScript += 'function onClickLevelDownAbility_' + skillAbility[i].ClassName + '(){';
      captionScript +=  'Ability_' + skillAbility[i].ClassName + '--;';
      captionScript +=  'if (Ability_' + skillAbility[i].ClassName + ' < document.getElementById("Ability_' + skillAbility[i].ClassName + '").min) Ability_' + skillAbility[i].ClassName + '= document.getElementById("Ability_' + skillAbility[i].ClassName + '").min;';
      captionScript +=  'document.getElementById("Ability_' + skillAbility[i].ClassName + '").value = Ability_' + skillAbility[i].ClassName + ';';
      //captionScript +=  'console.log(Ability_' + skillAbility[i].ClassName + ');';
      captionScript +=  'updateLuaScripts();';
      captionScript += '}';
    }

    if (skillTable[index].SkillFactor != undefined && skillTable[index].SkillFactor.length > 0) captionScript += tos.Lua2JS(scriptData[skillTable[index].SkillFactor]);
    if (skillTable[index].SkillSR != undefined && skillTable[index].SkillSR.length > 0) captionScript += tos.Lua2JS(scriptData[skillTable[index].SkillSR]);
    if (skillTable[index].CaptionTime != undefined && skillTable[index].CaptionTime.length > 0) captionScript += tos.Lua2JS(scriptData[skillTable[index].CaptionTime]);
    if (skillTable[index].CaptionRatio != undefined && skillTable[index].CaptionRatio.length > 0) captionScript += tos.Lua2JS(scriptData[skillTable[index].CaptionRatio]);
    if (skillTable[index].CaptionRatio2 != undefined && skillTable[index].CaptionRatio2.length > 0) captionScript += tos.Lua2JS(scriptData[skillTable[index].CaptionRatio2]);
    if (skillTable[index].CaptionRatio3 != undefined && skillTable[index].CaptionRatio3.length > 0) captionScript += tos.Lua2JS(scriptData[skillTable[index].CaptionRatio3]);
    if (skillTable[index].SpendItemCount != undefined && skillTable[index].SpendItemCount.length > 0) captionScript += tos.Lua2JS(scriptData[skillTable[index].SpendItemCount]);

    captionScript += tos.Lua2JS(scriptData['SCR_ABIL_ADD_SKILLFACTOR']);
    captionScript += tos.Lua2JS(scriptData['SCR_ABIL_ADD_SKILLFACTOR_TOOLTIP']);
    captionScript += tos.Lua2JS(scriptData['SCR_REINFORCEABILITY_TOOLTIP']);
    captionScript += '</script>';

    var stanceString = '';
    if (skillTable[index].ReqStance != undefined){
      var splited = skillTable[index].ReqStance.split(';');
      for (var i = 0; i < splited.length; i ++){
        stanceString += tos.StanceToName(tableData, splited[i]);
        if ((i+1) < splited.length) stanceString += ', ';
      }
    }

    var overHeat = 1;
    if (skillTable[index].OverHeatGroup != undefined && skillTable[index].OverHeatGroup.length > 0 && skillTable[index].SklUseOverHeat > 0){
      // for (var i = 0; i < cooldownTable.length; i ++){
      //   if (cooldownTable[i].ClassName === skillTable[index].OverHeatGroup){
      //     overHeat = cooldownTable[i].MaxOverTime / skillTable[index].SklUseOverHeat;
      //     break;
      //   }
      // }
      overHeat = skillTable[index].SklUseOverHeat;
    }

    var rawScript = '';
    if (skillTable[index].SkillFactor != undefined && skillTable[index].SkillFactor.length > 0 && scriptData[skillTable[index].SkillFactor] != undefined) rawScript += '<tr><td>SkillFactor</td><td class="script">' + scriptData[skillTable[index].SkillFactor] + '</td></tr>';
    if (skillTable[index].SkillSR != undefined && skillTable[index].SkillSR.length > 0 && scriptData[skillTable[index].SkillSR] != undefined) rawScript += '<tr><td>SkillSR</td><td class="script">' + scriptData[skillTable[index].SkillSR] + '</td></tr>';
    if (skillTable[index].CaptionTime != undefined && skillTable[index].CaptionTime.length > 0 && scriptData[skillTable[index].CaptionTime] != undefined) rawScript += '<tr><td>CaptionTime</td><td class="script">' + scriptData[skillTable[index].CaptionTime] + '</td></tr>';
    if (skillTable[index].CaptionRatio != undefined && skillTable[index].CaptionRatio.length > 0 && scriptData[skillTable[index].CaptionRatio] != undefined) rawScript += '<tr><td>CaptionRatio</td><td class="script">' + scriptData[skillTable[index].CaptionRatio] + '</td></tr>';
    if (skillTable[index].CaptionRatio2 != undefined && skillTable[index].CaptionRatio2.length > 0 && scriptData[skillTable[index].CaptionRatio2] != undefined) rawScript += '<tr><td>CaptionRatio2</td><td class="script">' + scriptData[skillTable[index].CaptionRatio2] + '</td></tr>';
    if (skillTable[index].CaptionRatio3 != undefined && skillTable[index].CaptionRatio3.length > 0 && scriptData[skillTable[index].CaptionRatio3] != undefined) rawScript += '<tr><td>CaptionRatio3</td><td class="script">' + scriptData[skillTable[index].CaptionRatio3] + '</td></tr>';
    if (skillTable[index].SpendItemCount != undefined && skillTable[index].SpendItemCount.length > 0 && scriptData[skillTable[index].SpendItemCount] != undefined) rawScript += '<tr><td>SpendItemCount</td><td class="script">' + scriptData[skillTable[index].SpendItemCount] + '</td></tr>';


    var output = layout_detail.toString();
    //output = output.replace(/style.css/g, '../Layout/style.css');
    output = output.replace(/%Icon%/g, '<img src="../img/icon/skillicon/icon_' + skillTable[index].Icon.toLowerCase() + '.png" />');
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
    output = output.replace(/%BasicCoolDown%/g, Number(skillTable[index].BasicCoolDown)/1000 + 's');
    output = output.replace(/%OverHeat%/g, overHeat);

    output = output.replace(/%Caption%/g, tos.parseCaption(skillTable[index].Caption));
    output = output.replace(/%Caption2%/g, tos.parseCaption(skillTable[index].Caption2));

    output = output.replace(/%AddAbility%/g, abilityString);

    output = output.replace(/%AddCaptionScript%/g, captionScript);

    output = output.replace(/%RawScripts%/g, rawScript);

    //output = output.replace(/%AddTopMenu%/g, layout_topMenu.toString());

    response.send(output);
  }

  return route;
}