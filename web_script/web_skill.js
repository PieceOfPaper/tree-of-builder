module.exports = function(app, serverSetting, serverData){
  var express = require('express');
  var fs = require('fs');
  //var url = require('url');
  var mysql = require('mysql');
  var mysqls = require('sync-mysql');

  var tos = require('../my_modules/TosModule');
  var dbLayout = require('../my_modules/DBLayoutModule');
  
  var route = express.Router();

  var layout = fs.readFileSync('./web/Layout/index-skill.html');
  var layout_topMenu = fs.readFileSync('./web/Layout/topMenu.html');

  //var search_box = fs.readFileSync('./web/Skill/search_box.html');
  // var jobTable = serverData['tableData']['job'];
  // var skillTable = serverData['tableData']['skill'];
  // var skillTreeTable = serverData['tableData']['skilltree'];

  route.get('/', function (request, response) {
    tos.RequestLog(request);
    var skillTable = serverData['tableData']['skill'];

    // id값이 존재하는 경우, 상세 페이지로 이동
    if (skillTable != undefined && request.query.id != undefined && request.query.id != ''){
      for (var i = 0; i < skillTable.length; i ++){
        if (skillTable[i].ClassID === Number(request.query.id)){
          skillDetailPage(i, request, response);
          return;
        }
      }
    }

    response.send('no data');
  });

  var layout_detail = fs.readFileSync('./web/Layout/index-skilldetail.html');

  function skillDetailPage(index, request, response) {
    var skillTable = serverData['tableData']['skill'];
    var skillTreeTable = serverData['tableData']['skilltree'];
    var cooldownTable = serverData['tableData']['cooldown'];

    var skillMaxLevel = 1;
    for (var i = 0; i < skillTreeTable.length; i ++){
      if (skillTreeTable[i].SkillName == skillTable[index].ClassName){
        skillMaxLevel = skillTreeTable[i].MaxLevel;
        break;
      }
    }

    var skillAbility = [];
    for (var i = 0; i < serverData['tableData']['ability'].length; i ++) {
      if (serverData['tableData']['ability'][i].SkillCategory === skillTable[index].ClassName){
        skillAbility.push(serverData['tableData']['ability'][i]);
      }
    }
    var skillAbilityJob = [];
    for (var i = 0; i < skillAbility.length; i ++){
      var hasJob = false;
      for (var j = 0; j < serverData['tableData']['ability_job'].length; j ++){
        if (skillAbility[i].ClassName === serverData['tableData']['ability_job'][j].ClassName){
          skillAbilityJob.push(serverData['tableData']['ability_job'][j]);
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
        abilityString += '<td align="center" style="width:calc(18px * 1.6666 * 2 + 10px);">';
        abilityString +=  '<input class="lv-add-input" type="number" id="Ability_' + skillAbility[i].ClassName + '" min="0" max="' + skillAbilityJob[i].MaxLevel + '" value="0" onchange="onChangeSkillLevel()"><br>';
        abilityString +=  '<div><button class="lv-add-button plus" onclick="onClickLevelUpAbility_' + skillAbility[i].ClassName + '()"><img src="../img2/button/btn_plus.png" /></button><button class="lv-add-button minus" onclick="onClickLevelDownAbility_' + skillAbility[i].ClassName + '()"><img src="../img2/button/btn_minus.png" /></button></div>';
        abilityString += '</td>';
      }
      abilityString += '<td align="center">' + tos.ImagePathToHTML(serverData['imagePath'][skillAbility[i].Icon.toLowerCase()], 64, 'class="ability-icon"') + '</td>';
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
    captionScript +=  'MNA:Number(0),';
    captionScript +=  'DEX:Number(0),';
    captionScript +=  'HP:Number(0),';
    captionScript +=  'MHP:Number(0),';
    captionScript +=  'SP:Number(0),';
    captionScript +=  'MSP:Number(0),';
    captionScript += '};';
    captionScript += 'return playerSetting; }';

    captionScript += 'var info=undefined;';

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
    captionScript += 'function SCR_CALC_BASIC_MDEF(pc){ return 0; }';
    captionScript += 'function GetZoneName(pc){ return 0; }';

    // captionScript += 'var currentSkill = {';
    // captionScript +=  'Level: Number(1),';
    // captionScript +=  'SklFactor:' + skillTable[index].SklFactor + ',';
    // captionScript +=  'SklFactorByLevel:' + skillTable[index].SklFactorByLevel + ',';
    // captionScript +=  'SklSR:' + skillTable[index].SklSR + ',';
    // captionScript +=  'AttackType:"' + skillTable[index].AttackType + '",';
    // captionScript +=  'Attribute:"' + skillTable[index].Attribute + '",';
    // captionScript +=  'SpendItemBaseCount:' + skillTable[index].SpendItemBaseCount + ',';
    // captionScript +=  'ReinforceAbility:"' + skillTable[index].ReinforceAbility + '",';
    // captionScript += '};';
    captionScript += 'var currentSkill=' + JSON.stringify(skillTable[index]) + ';';
    captionScript += 'currentSkill["Level"]=Number(1);';

    captionScript += 'document.getElementById("SkillLevel").max=' + skillMaxLevel + ';';
    captionScript += 'onChangeSkillLevel();';

    captionScript += 'function onChangeSkillLevel(){';
    captionScript +=  'currentSkill.Level = Number(document.getElementById("SkillLevel").value);';
    captionScript +=  'updateLuaScripts();';
    captionScript += '}';

    captionScript += 'function onClickLevelUp(){';
    captionScript +=  'currentSkill.Level ++;';
    captionScript +=  'if (currentSkill.Level > document.getElementById("SkillLevel").max) currentSkill.Level = Number(document.getElementById("SkillLevel").max);';
    captionScript +=  'document.getElementById("SkillLevel").value = currentSkill.Level;';
    captionScript +=  'updateLuaScripts();';
    captionScript += '}';

    captionScript += 'function onClickLevelDown(){';
    captionScript +=  'currentSkill.Level --;';
    captionScript +=  'if (currentSkill.Level < document.getElementById("SkillLevel").min) currentSkill.Level = Number(document.getElementById("SkillLevel").min);';
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
      captionScript +=  'Ability_' + skillAbility[i].ClassName + ' = document.getElementById("Ability_' + skillAbility[i].ClassName + '").value;';
      captionScript +=  'Ability_' + skillAbility[i].ClassName + '++;';
      captionScript +=  'if (Ability_' + skillAbility[i].ClassName + ' > document.getElementById("Ability_' + skillAbility[i].ClassName + '").max) Ability_' + skillAbility[i].ClassName + ' = document.getElementById("Ability_' + skillAbility[i].ClassName + '").max;';
      captionScript +=  'document.getElementById("Ability_' + skillAbility[i].ClassName + '").value = Ability_' + skillAbility[i].ClassName + ';';
      //captionScript +=  'console.log(Ability_' + skillAbility[i].ClassName + ');';
      captionScript +=  'updateLuaScripts();';
      captionScript += '}';

      captionScript += 'function onClickLevelDownAbility_' + skillAbility[i].ClassName + '(){';
      captionScript +=  'Ability_' + skillAbility[i].ClassName + ' = document.getElementById("Ability_' + skillAbility[i].ClassName + '").value;';
      captionScript +=  'Ability_' + skillAbility[i].ClassName + '--;';
      captionScript +=  'if (Ability_' + skillAbility[i].ClassName + ' < document.getElementById("Ability_' + skillAbility[i].ClassName + '").min) Ability_' + skillAbility[i].ClassName + '= document.getElementById("Ability_' + skillAbility[i].ClassName + '").min;';
      captionScript +=  'document.getElementById("Ability_' + skillAbility[i].ClassName + '").value = Ability_' + skillAbility[i].ClassName + ';';
      //captionScript +=  'console.log(Ability_' + skillAbility[i].ClassName + ');';
      captionScript +=  'updateLuaScripts();';
      captionScript += '}';
    }

    if (skillTable[index].SkillFactor != undefined && skillTable[index].SkillFactor.length > 0) captionScript += tos.Lua2JS(serverData['scriptData'][skillTable[index].SkillFactor]);
    if (skillTable[index].SkillSR != undefined && skillTable[index].SkillSR.length > 0) captionScript += tos.Lua2JS(serverData['scriptData'][skillTable[index].SkillSR]);
    if (skillTable[index].CaptionTime != undefined && skillTable[index].CaptionTime.length > 0) captionScript += tos.Lua2JS(serverData['scriptData'][skillTable[index].CaptionTime]);
    if (skillTable[index].CaptionRatio != undefined && skillTable[index].CaptionRatio.length > 0) captionScript += tos.Lua2JS(serverData['scriptData'][skillTable[index].CaptionRatio]);
    if (skillTable[index].CaptionRatio2 != undefined && skillTable[index].CaptionRatio2.length > 0) captionScript += tos.Lua2JS(serverData['scriptData'][skillTable[index].CaptionRatio2]);
    if (skillTable[index].CaptionRatio3 != undefined && skillTable[index].CaptionRatio3.length > 0) captionScript += tos.Lua2JS(serverData['scriptData'][skillTable[index].CaptionRatio3]);
    if (skillTable[index].SpendItemCount != undefined && skillTable[index].SpendItemCount.length > 0) captionScript += tos.Lua2JS(serverData['scriptData'][skillTable[index].SpendItemCount]);

    captionScript += tos.Lua2JS(serverData['scriptData']['SCR_ABIL_ADD_SKILLFACTOR']);
    captionScript += tos.Lua2JS(serverData['scriptData']['SCR_ABIL_ADD_SKILLFACTOR_TOOLTIP']);
    captionScript += tos.Lua2JS(serverData['scriptData']['SCR_REINFORCEABILITY_TOOLTIP']);
    captionScript += '</script>';

    var stanceString = '';
    if (skillTable[index].ReqStance != undefined){
      var splited = skillTable[index].ReqStance.split(';');
      for (var i = 0; i < splited.length; i ++){
        stanceString += tos.StanceToName(serverData, splited[i]);
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
    if (skillTable[index].SkillFactor != undefined && skillTable[index].SkillFactor.length > 0 && serverData['scriptData'][skillTable[index].SkillFactor] != undefined) rawScript += '<tr><td>SkillFactor</td></tr><tr><td class="script">' + serverData['scriptData'][skillTable[index].SkillFactor] + '</td></tr>';
    if (skillTable[index].SkillSR != undefined && skillTable[index].SkillSR.length > 0 && serverData['scriptData'][skillTable[index].SkillSR] != undefined) rawScript += '<tr><td>SkillSR</td></tr><tr><td class="script">' + serverData['scriptData'][skillTable[index].SkillSR] + '</td></tr>';
    if (skillTable[index].CaptionTime != undefined && skillTable[index].CaptionTime.length > 0 && serverData['scriptData'][skillTable[index].CaptionTime] != undefined) rawScript += '<tr><td>CaptionTime</td></tr><tr><td class="script">' + serverData['scriptData'][skillTable[index].CaptionTime] + '</td></tr>';
    if (skillTable[index].CaptionRatio != undefined && skillTable[index].CaptionRatio.length > 0 && serverData['scriptData'][skillTable[index].CaptionRatio] != undefined) rawScript += '<tr><td>CaptionRatio</td></tr><tr><td class="script">' + serverData['scriptData'][skillTable[index].CaptionRatio] + '</td></tr>';
    if (skillTable[index].CaptionRatio2 != undefined && skillTable[index].CaptionRatio2.length > 0 && serverData['scriptData'][skillTable[index].CaptionRatio2] != undefined) rawScript += '<tr><td>CaptionRatio2</td></tr><tr><td class="script">' + serverData['scriptData'][skillTable[index].CaptionRatio2] + '</td></tr>';
    if (skillTable[index].CaptionRatio3 != undefined && skillTable[index].CaptionRatio3.length > 0 && serverData['scriptData'][skillTable[index].CaptionRatio3] != undefined) rawScript += '<tr><td>CaptionRatio3</td></tr><tr><td class="script">' + serverData['scriptData'][skillTable[index].CaptionRatio3] + '</td></tr>';
    if (skillTable[index].SpendItemCount != undefined && skillTable[index].SpendItemCount.length > 0 && serverData['scriptData'][skillTable[index].SpendItemCount] != undefined) rawScript += '<tr><td>SpendItemCount</td></tr><tr><td class="script">' + serverData['scriptData'][skillTable[index].SpendItemCount] + '</td></tr>';

    var skillGemString = '';
    var skillGemData = tos.FindDataClassName(serverData, 'item_gem', 'Gem_'+skillTable[index].ClassName);
    if (skillGemData == undefined) skillGemData = tos.FindDataClassName(serverData, 'item_gem', 'GEM_'+skillTable[index].ClassName);
    if (skillGemData!=undefined){
      //skillGemString += '<p><a href="../Item?table='+skillGemData.TableName+'&id='+skillGemData.ClassID+'"><img class="item-material-icon" src="../img/icon/mongem/'+skillGemData.Icon.toLowerCase()+'.png"/>'+skillGemData.Name+'</a></p>';
      skillGemString += tos.GetItemResultString(serverData, skillGemData.ClassName);
    }

    var output = layout_detail.toString();
    //output = output.replace(/style.css/g, '../Layout/style.css');
    //output = output.replace(/%Icon%/g, '<img src="../img/icon/skillicon/icon_' + skillTable[index].Icon.toLowerCase() + '.png" />');
    output = output.replace(/%Icon%/g, tos.ImagePathToHTML(serverData['imagePath']['icon_'+skillTable[index].Icon.toLowerCase()]));
    output = output.replace(/%IconPath%/g, serverData['imagePath']['icon_'+skillTable[index].Icon.toLowerCase()] == undefined ? '' : serverData['imagePath']['icon_'+skillTable[index].Icon.toLowerCase()].path);
    output = output.replace(/%Name%/g, skillTable[index].Name);
    output = output.replace(/%EngName%/g, skillTable[index].EngName);
    output = output.replace(/%ClassName%/g, skillTable[index].ClassName);
    output = output.replace(/%ClassID%/g, skillTable[index].ClassID);
    output = output.replace(/%Rank%/g, skillTable[index].Rank);
    output = output.replace(/%JobName%/g, tos.JobToJobName(serverData, skillTable[index].Job));
    output = output.replace(/%ClassType%/g, skillTable[index].ClassType);
    output = output.replace(/%ValueType%/g, skillTable[index].ValueType);
    output = output.replace(/%Attribute%/g, tos.AttributeToName(serverData, skillTable[index].Attribute));
    output = output.replace(/%AttackType%/g, tos.AttributeToName(serverData, skillTable[index].AttackType));
    output = output.replace(/%HitType%/g, skillTable[index].HitType);
    output = output.replace(/%EnableCompanion%/g, skillTable[index].EnableCompanion);
    output = output.replace(/%ReqStance%/g, stanceString);

    output = output.replace(/%SklFactor%/g, Number(skillTable[index].SklFactor));
    output = output.replace(/%SklFactorByLevel%/g, Number(skillTable[index].SklFactorByLevel));
    output = output.replace(/%SklSR%/g, Number(skillTable[index].SklSR));
    output = output.replace(/%BasicSP%/g, Number(skillTable[index].BasicSP));
    output = output.replace(/%LvUpSpendSp%/g, Number(skillTable[index].LvUpSpendSp));
    output = output.replace(/%BasicCoolDown%/g, Number(skillTable[index].BasicCoolDown)/1000 + 's');
    output = output.replace(/%OverHeat%/g, overHeat);

    output = output.replace(/%DefaultHitDelay%/g, Number(skillTable[index].DefaultHitDelay)/1000 + 's');
    output = output.replace(/%ShootTime%/g, Number(skillTable[index].ShootTime)/1000 + 's');
    output = output.replace(/%CancelTime%/g, Number(skillTable[index].CancelTime)/1000 + 's');
    output = output.replace(/%DelayTime%/g, Number(skillTable[index].DelayTime)/1000 + 's');
    output = output.replace(/%DeadHitDelay%/g, Number(skillTable[index].DeadHitDelay)/1000 + 's');
    output = output.replace(/%HitTime%/g, Number(skillTable[index].HitTime)/1000 + 's');
    output = output.replace(/%AniTime%/g, Number(skillTable[index].AniTime)/1000 + 's');

    output = output.replace(/%SkillGem%/g, skillGemString);

    output = output.replace(/%Keyword%/g, skillTable[index].Keyword==undefined?'':skillTable[index].Keyword.replace(/;/g,', '));

    output = output.replace(/%Caption%/g, tos.parseCaption(skillTable[index].Caption));
    output = output.replace(/%Caption2%/g, tos.parseCaption(skillTable[index].Caption2));

    output = output.replace(/%AddAbility%/g, abilityString);

    output = output.replace(/%AddCaptionScript%/g, captionScript);

    output = output.replace(/%RawScripts%/g, rawScript);

    //output = output.replace(/%AddTopMenu%/g, layout_topMenu.toString());

    
    var connection = new mysqls(serverSetting['dbconfig']);
    var comment_results = connection.query('SELECT * FROM comment WHERE state=0 AND page="Skill" AND page_arg1="'+''+'" AND page_arg2='+request.query.id+' ORDER BY time DESC;');
    if (comment_results != undefined){
      for (param in comment_results){
        var nickname_results = connection.query('SELECT * FROM user WHERE userno="'+comment_results[param].userno+'";');
        if (nickname_results!=undefined && nickname_results.length>0){
          comment_results[param]["nickname"]=nickname_results[0].nickname;
        }
      }
    }
    if (request.session.login_userno == undefined){
      output = output.replace(/%Comment%/g, dbLayout.Layout_Comment(undefined,'Skill','',request.query.id,comment_results));
    } else {
      var user_results = connection.query('SELECT * FROM user WHERE userno="'+request.session.login_userno+'";');
      output = output.replace(/%Comment%/g, dbLayout.Layout_Comment(user_results[0],'Skill','',request.query.id,comment_results));
    }


    response.send(output);
  }

  return route;
}