module.exports = function(app, tableData, scriptData){
  var express = require('express');
  var fs = require('fs');
  //var url = require('url');
  var tos = require('../my_modules/TosModule');
  
  var route = express.Router();

  var layout = fs.readFileSync('./web/Layout/index-skill.html');
  var layout_topMenu = fs.readFileSync('./web/Layout/topMenu.html');

  //var search_box = fs.readFileSync('./web/Skill/search_box.html');
  var jobTable = tableData['job'];
  var skillTable = tableData['skill'];
  var skillTreeTable = tableData['skilltree'];

  route.get('/', function (request, response) {
    // id값이 존재하는 경우, 상세 페이지로 이동
    if (request.query.id != undefined && request.query.id != ''){
      for (var i = 0; i < skillTable.length; i ++){
        if (skillTable[i].ClassID.indexOf(request.query.id) > -1){
          skillDetailPage(i, request, response);
          return;
        }
      }
    }

    // string query에 검색 데이터가 있는 경우, 검색 결과 가져옴.
    var resultArray = [];
    if (request.query.searchName === undefined || request.query.searchName === ''){
      // for (var i = 0; i < skillTable.length; i ++){
      //   if (resultArray.length >= 10) break;
      //   resultArray.push(skillTable[i]);
      // }
    } else {
      for (var i = 0; i < skillTable.length; i ++){
        //if (resultArray.length >= 10) break;

        if (request.query.searchType === "Name" && skillTable[i].Name.indexOf(request.query.searchName) > -1)
          resultArray.push(skillTable[i]);
        else if (request.query.searchType === "ClassName" && skillTable[i].ClassName.indexOf(request.query.searchName) > -1)
        resultArray.push(skillTable[i]);
      }
    }

    var resultString = '';
    for (var i = 0; i < resultArray.length; i ++){
      resultString += '<tr>';
      resultString += '<td align="center"><a href="?id=' + resultArray[i].ClassID + '">' + resultArray[i].ClassID + '</a></td>';
      resultString += '<td align="center"><img src="../img/icon/skillicon/icon_' + resultArray[i].Icon  + '.png"/></td>';
      resultString += '<td>';
      resultString +=   '<p>' + resultArray[i].Name + '<br/>' + resultArray[i].ClassName + '</p>';
      resultString += '</td>';
      resultString += '</tr>';
    }


    var output = layout.toString();
    output = output.replace(/style.css/g, '../Layout/style.css');
    output = output.replace(/%SearchResult%/g, resultString);

    output = output.replace(/%AddTopMenu%/g, layout_topMenu.toString());

    response.send(output);
    //console.log(request.query.searchType + " " + request.query.searchName);
  });

  var layout_detail = fs.readFileSync('./web/Layout/index-skilldetail.html');

  function skillDetailPage(index, request, response) {

    var skillMaxLevel = 1;
    for (var i = 0; i < skillTreeTable.length; i ++){
      if (skillTreeTable[i].ClassID == skillTable[index].ClassID){
        skillMaxLevel = skillTreeTable[i].MaxLevel;
        break;
      }
    }

    var captionScript = '';
    captionScript += '<script>';

    captionScript += 'function GetSkillOwner(skill){ return undefined; }';
    captionScript += 'function GetAbility(pc, ability){ return undefined; }';

    captionScript += 'var currentSkill = {';
    captionScript +=  'Level: 1,';
    captionScript +=  'SklFactor:' +  + Number(skillTable[index].SklFactor) + ',';
    captionScript +=  'SklFactorByLevel:' +  + Number(skillTable[index].SklFactorByLevel) + ',';
    captionScript += '};';

    captionScript += 'document.getElementById("SkillLevel").max=' + skillMaxLevel + ';';
    captionScript += 'onChangeSkillLevel();';

    captionScript += 'function onChangeSkillLevel(){';
    captionScript +=  'currentSkill.Level = document.getElementById("SkillLevel").value;';
    captionScript +=  'updateSkillFactor();';
    captionScript += '}';

    captionScript += 'function updateSkillFactor(){';
    captionScript +=  'document.getElementById("SkillFactor").innerHTML=' + skillTable[index].SkillFactor + '(currentSkill);';
    captionScript += '}';

    captionScript += tos.Lua2JS(scriptData[skillTable[index].SkillFactor]);
    captionScript += tos.Lua2JS(scriptData['SCR_ABIL_ADD_SKILLFACTOR']);
    captionScript += tos.Lua2JS(scriptData['SCR_ABIL_ADD_SKILLFACTOR_TOOLTIP']);
    captionScript += '</script>';

    // console.log(scriptData[skillTable[index].SkillFactor])
    // console.log(tos.Lua2JS(scriptData[skillTable[index].SkillFactor]))

    var output = layout_detail.toString();
    output = output.replace(/style.css/g, '../Layout/style.css');
    output = output.replace(/%Name%/g, skillTable[index].Name);
    output = output.replace(/%EngName%/g, skillTable[index].EngName);
    output = output.replace(/%ClassName%/g, skillTable[index].ClassName);
    output = output.replace(/%ClassID%/g, skillTable[index].ClassID);
    output = output.replace(/%Rank%/g, skillTable[index].Rank);
    output = output.replace(/%JobName%/g, JobToJobName(skillTable[index].Job));
    output = output.replace(/%ClassType%/g, skillTable[index].ClassType);
    output = output.replace(/%ValueType%/g, skillTable[index].ValueType);
    output = output.replace(/%Attribute%/g, skillTable[index].Attribute);
    output = output.replace(/%AttackType%/g, skillTable[index].AttackType);
    output = output.replace(/%HitType%/g, skillTable[index].HitType);

    output = output.replace(/%SklFactor%/g, Number(skillTable[index].SklFactor));
    output = output.replace(/%SklFactorByLevel%/g, Number(skillTable[index].SklFactorByLevel));
    output = output.replace(/%BasicSP%/g, Number(skillTable[index].BasicSP));
    output = output.replace(/%LvUpSpendSp%/g, Number(skillTable[index].LvUpSpendSp));

    output = output.replace(/%Caption%/g, tos.parseCaption(skillTable[index].Caption));
    output = output.replace(/%Caption2%/g, tos.parseCaption(skillTable[index].Caption2));
    output = output.replace(/%AddCaptionScript%/g, captionScript);

    output = output.replace(/%AddTopMenu%/g, layout_topMenu.toString());

    response.send(output);
  }

  function JobToJobName(job){
    for (var i = 0; i < jobTable.length; i ++){
      if (jobTable[i].EngName === job) return jobTable[i].Name;
    }
    return job;
  }

  return route;
}