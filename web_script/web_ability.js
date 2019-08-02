module.exports = function(app, serverSetting, serverData){
  var express = require('express');
  var fs = require('fs');
  //var url = require('url');
  var mysql = require('mysql');
  var mysqls = require('sync-mysql');

  var tos = require('../my_modules/TosModule');
  var dbLayout = require('../my_modules/DBLayoutModule');
  
  var route = express.Router();

  var layout = fs.readFileSync('./web/Layout/index-ability.html');
  var layout_topMenu = fs.readFileSync('./web/Layout/topMenu.html');

  //var search_box = fs.readFileSync('./web/Skill/search_box.html');
  // var jobTable = serverData['tableData']['job'];
  // var skillTable = serverData['tableData']['skill'];
  // var skillTreeTable = serverData['tableData']['skilltree'];

  route.get('/', function (request, response) {
    tos.RequestLog(request);
    
    var abilityTable = serverData['tableData']['ability'];

    // id값이 존재하는 경우, 상세 페이지로 이동
    if (abilityTable != undefined && request.query.id != undefined && request.query.id != ''){
      for (var i = 0; i < abilityTable.length; i ++){
        if (abilityTable[i].ClassID === Number(request.query.id)){
          abilityDetailPage(i, request, response);
          return;
        }
      }
    }

    response.send(fs.readFileSync('./web/Layout/message.html').toString().replace(/%Message%/g, 'No Data'));
  });

  var layout_detail = fs.readFileSync('./web/Layout/index-abilitydetail.html');

  function abilityDetailPage(index, request, response) {
    var skillTable = serverData['tableData']['skill'];
    var abilityTable = serverData['tableData']['ability'];
    //var skillTreeTable = serverData['tableData']['skilltree'];
    //var jobTable = serverData['tableData']['job'];

    var abilityJob;
    for (var i = 0; i < serverData['tableData']['ability_job'].length; i ++){
      if (serverData['tableData']['ability_job'][i].ClassName === abilityTable[index].ClassName){
        abilityJob = serverData['tableData']['ability_job'][i];
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
      //captionScript +=  'console.log(i);'
      captionScript +=  'price+=Number(' + abilityJob.ScrCalcPrice + '(undefined,"' + abilityTable[index].ClassName + '",i,' + abilityJob.MaxLevel + '));';
      captionScript += '}';
      captionScript += 'if (document.getElementById("PricePoint") != undefined) document.getElementById("PricePoint").innerHTML=price;';
    }
    captionScript += '}';

    if (abilityJob != undefined){
      captionScript += tos.Lua2JS(serverData['scriptData'][abilityJob.ScrCalcPrice]).replace('return price, time', 'return price').replace('return Math.floor(price), time', 'return Math.floor(price)').replace('var price, time', 'var price').replace('{ 1, 2, 3, 4, 5,','[ 1, 2, 3, 4, 5,').replace('6, 7, 8, 8.5, 9 }','6, 7, 8, 8.5, 9 ]').replace('#increseFactorList','increseFactorList.length').replace('baseFactor^(abilLevel - 1) * increseFactorList[index]','Math.pow(baseFactor,(abilLevel - 1)) * increseFactorList[index-1]');
    }
    captionScript += tos.Lua2JS(serverData['scriptData']['ABIL_COMMON_PRICE']).replace('return price, time', 'return price').replace('var price, time', 'var price');
    
    captionScript += '</script>';

    
    var jobsString = '';
    if (abilityTable[index].Job != undefined){
      var splited = abilityTable[index].Job.split(';');
      for (var i = 0; i < splited.length; i ++){
        jobsString += tos.JobClassNameToJobName(serverData, splited[i]);
        if ((i+1) < splited.length) jobsString += ', ';
      }
    }

    var skillString = '';
    if (abilityTable[index].SkillCategory != undefined){
      // for (var i = 0; i < skillTable.length; i ++){
      //   if (skillTable[i].ClassName === abilityTable[index].SkillCategory){
      //     skillString = '<a href="../Skill/?id=' + skillTable[i].ClassID + '">' + skillTable[i].Name + '</a>';
      //     break;
      //   }
      // }
      skillString = tos.GetSkillString(serverData, abilityTable[index].SkillCategory);
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
    output = output.replace(/style.css/g, '../style.css');
    //output = output.replace(/%Icon%/g, '<img src="../img/icon/skillicon/' + abilityTable[index].Icon + '.png" />');
    output = output.replace(/%Icon%/g, tos.ImagePathToHTML(serverData['imagePath'][abilityTable[index].Icon.toLowerCase()]));
    output = output.replace(/%IconPath%/g, serverData['imagePath'][abilityTable[index].Icon.toLowerCase()] == undefined ? '' : serverData['imagePath'][abilityTable[index].Icon.toLowerCase()].path);
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

    //output = output.replace(/%AddTopMenu%/g, layout_topMenu.toString());


    if (serverSetting['dbconfig'] == undefined){
      output = output.replace(/%Comment%/g, '');
    } else {
      var connection = new mysqls(serverSetting['dbconfig']);
      var comment_results = connection.query('SELECT * FROM comment WHERE state=0 AND page="Ability" AND page_arg1="'+''+'" AND page_arg2='+request.query.id+' ORDER BY time DESC;');
      if (comment_results != undefined){
        for (param in comment_results){
          var nickname_results = connection.query('SELECT * FROM user WHERE userno="'+comment_results[param].userno+'";');
          if (nickname_results!=undefined && nickname_results.length>0){
            comment_results[param]["nickname"]=nickname_results[0].nickname;
          }
        }
      }
      if (request.session.login_userno == undefined){
        output = output.replace(/%Comment%/g, dbLayout.Layout_Comment(undefined,'Ability','',request.query.id,comment_results));
      } else {
        var user_results = connection.query('SELECT * FROM user WHERE userno="'+request.session.login_userno+'";');
        output = output.replace(/%Comment%/g, dbLayout.Layout_Comment(user_results[0],'Ability','',request.query.id,comment_results));
      }
      connection.dispose();
    }

    response.send(output);
  }

  return route;
}