module.exports = function(app, serverSetting, serverData){
    var express = require('express');
    var fs = require('fs');
    //var url = require('url');
  var mysql = require('mysql');
  var mysqls = require('sync-mysql');

    var tos = require('../my_modules/TosModule');
    var dbLayout = require('../my_modules/DBLayoutModule');
    
    var route = express.Router();
  
    route.get('/', function (request, response) {
      tos.RequestLog(request);
        var monsterTable = serverData['tableData']['monster'];

        // id값이 존재하는 경우, 상세 페이지로 이동
        if (monsterTable != undefined && request.query.id != undefined && request.query.id != ''){
          for (var i = 0; i < monsterTable.length; i ++){
            if (monsterTable[i].ClassID === Number(request.query.id)){
                monsterDetailPage(i, request, response);
              return;
            }
          }
        }

        response.send(fs.readFileSync('./web/Layout/message.html').toString().replace(/%Message%/g, 'No Data'));
    });
  

    var layout_detail = fs.readFileSync('./web/MonsterPage/detail.html');
    function monsterDetailPage(index, request, response) {
        var monsterTable = serverData['tableData']['monster'];
        var skillTable = serverData['tableData']['skill_mon'];
        
        var statScript = '';
        statScript += '<script>';
        statScript += 'var rawData=' + JSON.stringify(monsterTable[index]) + ';';
        statScript += 'rawData["Lv"]=rawData["Level"];'
        statScript += 'if (rawData["MNA"] == undefined) rawData["MNA"]=0;'
        statScript += 'if (rawData["MSP_BM"] == undefined) rawData["MSP_BM"]=0;'
        statScript += 'var statDataTable=[];'
        statScript += 'statDataTable["Stat_Monster"]=' + JSON.stringify(serverData['tableData']['statbase_monster']) + ';';
        statScript += 'statDataTable["Stat_Monster_Race"]=' + JSON.stringify(serverData['tableData']['statbase_monster_race']) + ';';
        statScript += 'statDataTable["Stat_Monster_Type"]=' + JSON.stringify(serverData['tableData']['statbase_monster_type']) + ';';
        statScript += 'statDataTable["item_grade"]=' + JSON.stringify(serverData['tableData']['item_grade']) + ';';

        statScript += 'function TryGetProp(data, prop, defValue){';
        statScript +=  'if (data[prop] === undefined) {';
        statScript +=    'if (defValue != undefined) return defValue;'; 
        statScript +=    'return 0; }';
        statScript +=  'return data[prop];'; 
        statScript += '}';

        statScript += 'function GetExProp(data, prob){ ';
        statScript +=  'return data[prob];'; 
        statScript += '}';
        
        statScript += 'function GetClass(table, className){';
        statScript +=   'if (table=="Monster" && className==rawData.ClassName) return rawData;';
        statScript +=   'if (statDataTable[table]==undefined) return undefined;';
        statScript +=   'for(var i=0;i<statDataTable[table].length;i++){';
        statScript +=       'if (statDataTable[table][i].ClassName == className) return statDataTable[table][i];';
        statScript +=   '}';
        statScript +=   'return undefined;'; 
        statScript += '}';

        statScript += 'function GetClassByType(table, id){';
        statScript +=   'if (statDataTable[table]==undefined) return undefined;';
        statScript +=   'return statDataTable[table][id-1];'; 
        statScript += '}';

        statScript += 'function GetClassByNumProp(table, prob, id){';
        statScript +=   'if (statDataTable[table]==undefined) return undefined;';
        statScript +=   'for(var i=0;i<statDataTable[table].length;i++){';
        statScript +=       'if (statDataTable[table][i][prob] == id) return statDataTable[table][i];';
        statScript +=   '}';
        statScript +=   'return undefined;'; 
        statScript += '}';

        statScript += 'function MinMaxCorrection(value, min, max){';
        statScript +=   'if (value > max) return max;';
        statScript +=   'if (value < min) return min;';
        statScript +=   'return value;';
        statScript += '}';

        statScript += 'function NumberComma(x) { if (x == undefined) return "";'; 
        statScript += 'return x.toLocaleString(); }';

        //statScript += 'function SCR_MON_ITEM_ARMOR_DEF_CALC(pc){ return 0; }';
        //statScript += 'function SCR_MON_ITEM_ARMOR_MDEF_CALC(pc){ return 0; }';

        statScript += 'document.getElementById("stat_STR").innerText=NumberComma(SCR_Get_MON_STR(rawData));';
        statScript += 'document.getElementById("stat_CON").innerText=NumberComma(SCR_Get_MON_CON(rawData));';
        statScript += 'document.getElementById("stat_INT").innerText=NumberComma(SCR_Get_MON_INT(rawData));';
        statScript += 'document.getElementById("stat_DEX").innerText=NumberComma(SCR_Get_MON_DEX(rawData));';
        statScript += 'document.getElementById("stat_MNA").innerText=NumberComma(SCR_Get_MON_MNA(rawData));';
        statScript += 'document.getElementById("stat_EXP").innerText=NumberComma(SCR_GET_MON_EXP(rawData));';
        statScript += 'document.getElementById("stat_JOBEXP").innerText=NumberComma(SCR_GET_MON_JOBEXP(rawData));';
        statScript += 'document.getElementById("stat_DEF").innerText=NumberComma(SCR_Get_MON_DEF(rawData));';
        statScript += 'document.getElementById("stat_MDEF").innerText=NumberComma(SCR_Get_MON_MDEF(rawData));';
        statScript += 'document.getElementById("stat_CRTATK").innerText=NumberComma(SCR_Get_MON_CRTATK(rawData));';
        statScript += 'document.getElementById("stat_CRTMATK").innerText=NumberComma(SCR_Get_MON_CRTMATK(rawData));';
        statScript += 'document.getElementById("stat_MINPATK").innerText=NumberComma(SCR_Get_MON_MINPATK(rawData));';
        statScript += 'document.getElementById("stat_MAXPATK").innerText=NumberComma(SCR_Get_MON_MAXPATK(rawData));';
        statScript += 'document.getElementById("stat_MINMATK").innerText=NumberComma(SCR_Get_MON_MINMATK(rawData));';
        statScript += 'document.getElementById("stat_MAXMATK").innerText=NumberComma(SCR_Get_MON_MAXMATK(rawData));';
        statScript += 'document.getElementById("stat_MHP").innerText=NumberComma(SCR_Get_MON_MHP(rawData));';
        statScript += 'document.getElementById("stat_MSP").innerText=NumberComma(SCR_Get_MON_MSP(rawData));';
        statScript += 'document.getElementById("stat_CRTHR").innerText=NumberComma(SCR_Get_MON_CRTHR(rawData));';
        statScript += 'document.getElementById("stat_CRTDR").innerText=NumberComma(SCR_Get_MON_CRTDR(rawData));';

        statScript += tos.Lua2JS(serverData['scriptData']['GET_MON_STAT']).replace('var statRateList = { \'STR\', \'INT\', \'CON\', \'MNA\', \'DEX\' };', 'var statRateList = [ \'STR\', \'INT\', \'CON\', \'MNA\', \'DEX\' ];').replace('for i = 1, #statRateList do', 'for(i in statRateList){');
        statScript += tos.Lua2JS(serverData['scriptData']['SCR_Get_MON_STR']);
        statScript += tos.Lua2JS(serverData['scriptData']['SCR_Get_MON_CON']);
        statScript += tos.Lua2JS(serverData['scriptData']['SCR_Get_MON_INT']);
        statScript += tos.Lua2JS(serverData['scriptData']['SCR_Get_MON_MNA']);
        statScript += tos.Lua2JS(serverData['scriptData']['SCR_Get_MON_DEX']);
        statScript += tos.Lua2JS(serverData['scriptData']['SCR_GET_MON_EXP']);
        statScript += tos.Lua2JS(serverData['scriptData']['SCR_GET_MON_JOBEXP']);
        statScript += tos.Lua2JS(serverData['scriptData']['SCR_Get_MON_DEF']);
        statScript += tos.Lua2JS(serverData['scriptData']['SCR_Get_MON_MDEF']);
        statScript += tos.Lua2JS(serverData['scriptData']['SCR_RACE_TYPE_RATE']).replace('for i = 1, #defTypeList do','for(var i=0;i<defTypeList.length;i++){').replace('raceTypeRateTable[#raceTypeRateTable + 1]','raceTypeRateTable[i + 1]').replace(/{"DEF", "MDEF"}/g,'["DEF", "MDEF"]');
        statScript += tos.Lua2JS(serverData['scriptData']['SCR_Get_MON_CRTATK']);
        statScript += tos.Lua2JS(serverData['scriptData']['SCR_Get_MON_CRTMATK']);
        statScript += tos.Lua2JS(serverData['scriptData']['SCR_Get_MON_MINPATK']).replace('{ "PATK_BM", "MINPATK_BM" }', '[ "PATK_BM", "MINPATK_BM" ]').replace('{\'PATK_RATE_BM\', \'MINPATK_RATE_BM\' }', '[\'PATK_RATE_BM\', \'MINPATK_RATE_BM\' ]').replace('for i = 1, #byBuffList do','for(i in byBuffList){').replace('for i = 1, #rateBuffList do','for(i in byBuffList){');
        statScript += tos.Lua2JS(serverData['scriptData']['SCR_Get_MON_MAXPATK']).replace('{ "PATK_BM", "MAXPATK_BM" }', '[ "PATK_BM", "MAXPATK_BM" ]').replace('{\'PATK_RATE_BM\', \'MAXPATK_RATE_BM\' }', '[\'PATK_RATE_BM\', \'MAXPATK_RATE_BM\' ]').replace('for i = 1, #byBuffList do','for(i in byBuffList){').replace('for i = 1, #rateBuffList do','for(i in byBuffList){');
        statScript += tos.Lua2JS(serverData['scriptData']['SCR_Get_MON_MINMATK']).replace('{ "MATK_BM", "MINMATK_BM" }', '[ "MATK_BM", "MINMATK_BM" ]').replace('{\'MATK_RATE_BM\', \'MINMATK_RATE_BM\' }', '[\'MATK_RATE_BM\', \'MINMATK_RATE_BM\' ]').replace('for i = 1, #byBuffList do','for(i in byBuffList){').replace('for i = 1, #rateBuffList do','for(i in byBuffList){');
        statScript += tos.Lua2JS(serverData['scriptData']['SCR_Get_MON_MAXMATK']).replace('{ "MATK_BM", "MAXMATK_BM" }', '[ "PATK_BM", "MAXMATK_BM" ]').replace('{\'MATK_RATE_BM\', \'MAXMATK_RATE_BM\' }', '[\'MATK_RATE_BM\', \'MAXMATK_RATE_BM\' ]').replace('for i = 1, #byBuffList do','for(i in byBuffList){').replace('for i = 1, #rateBuffList do','for(i in byBuffList){');
        statScript += tos.Lua2JS(serverData['scriptData']['SCR_MON_ITEM_WEAPON_CALC']).replace('var basicGradeRatio, reinforceGradeRatio = SCR_MON_ITEM_GRADE_RATE(self, itemGrade);','var basicGradeRatio = SCR_MON_ITEM_GRADE_RATE(self, itemGrade)[0]; var reinforceGradeRatio = SCR_MON_ITEM_GRADE_RATE(self, itemGrade)[1];');
        statScript += tos.Lua2JS(serverData['scriptData']['SCR_MON_ITEM_GRADE_RATE']).replace('{ "Normal", "Magic", "Rare", "Unique", "Legend" }', '[ "Normal", "Magic", "Rare", "Unique", "Legend" ]').replace('table.find(gradeList, itemGrade)', 'gradeList.indexOf(itemGrade)').replace('return basicGradeRatio, reinforceGradeRatio', 'return [basicGradeRatio, reinforceGradeRatio]');
        statScript += tos.Lua2JS(serverData['scriptData']['SCR_GET_ITEM_GRADE_RATIO']);
        statScript += tos.Lua2JS(serverData['scriptData']['SCR_MON_ITEM_REINFORCE_WEAPON_CALC']);
        statScript += tos.Lua2JS(serverData['scriptData']['SCR_MON_ITEM_TRANSCEND_CALC']);
        statScript += tos.Lua2JS(serverData['scriptData']['SCR_Get_MON_MHP']);
        statScript += tos.Lua2JS(serverData['scriptData']['SCR_Get_MON_MSP']).replace('defRatioTable[#defRatioTable + 1]','defRatioTable[i + 1]');
        statScript += tos.Lua2JS(serverData['scriptData']['SCR_MON_ITEM_ARMOR_DEF_CALC']);
        statScript += tos.Lua2JS(serverData['scriptData']['SCR_MON_ITEM_ARMOR_MDEF_CALC']);
        statScript += tos.Lua2JS(serverData['scriptData']['SCR_MON_ITEM_ARMOR_CALC']).replace('var basicGradeRatio, reinforceGradeRatio = SCR_MON_ITEM_GRADE_RATE(self, itemGrade);','var basicGradeRatio = SCR_MON_ITEM_GRADE_RATE(self, itemGrade)[0]; var reinforceGradeRatio = SCR_MON_ITEM_GRADE_RATE(self, itemGrade)[1];').replace('for i = 1, #defTypeList do','for(var i=0;i<defTypeList.length;i++){').replace('raceTypeRateTable[#raceTypeRateTable + 1]','raceTypeRateTable[i + 1]').replace(/{"DEF", "MDEF"}/g,'["DEF", "MDEF"]').replace('defRatioTable[#defRatioTable + 1]','defRatioTable[i + 1]');
        statScript += tos.Lua2JS(serverData['scriptData']['SCR_MON_ITEM_REINFORCE_ARMOR_CALC']);
        statScript += tos.Lua2JS(serverData['scriptData']['SCR_Get_MON_CRTHR']);
        statScript += tos.Lua2JS(serverData['scriptData']['SCR_Get_MON_CRTDR']);
        statScript += tos.Lua2JS(serverData['scriptData']['SCR_MON_STAT_RATE']);
        statScript += '</script>';

        var skillList = [];
        for (param in skillTable){
          if (skillTable[param].ClassName.indexOf('Mon_'+monsterTable[index].SkillType+'_Skill_') > -1){
            skillList.push(skillTable[param]);
          }
        }
        var skillString = '';
        skillString += '<table><tbody>';
        skillString += '<tr><td>Name</td><td>Factor</td><td>SR</td><td>CD</td></tr>';
        if (skillList.length > 0){
          for (var i=0;i<skillList.length;i++){
            skillString += '<tr>';
            //skillString += '<td><a href="../Skill?id='+skillList[i].ClassID+'">'+skillList[i].Name+'</a></td>';
            skillString += '<td>'+tos.GetSkillString(serverData,skillList[i].ClassName)+'</td>';
            skillString += '<td>'+skillList[i].SklFactor+'%</td>';
            skillString += '<td>'+skillList[i].SklSR+'</td>';
            skillString += '<td>'+(skillList[i].BasicCoolDown/1000)+'s</td>';
            skillString += '</tr>';
          }
        }
        skillString += '</tbody></table>';

        var genmapString = '';
        for (param in serverData['tableData']['map2']){
          var mongetTable = serverData['tableData']['GenType_'+serverData['tableData']['map2'][param].ClassName];
          var has = false;
          if (mongetTable != undefined){
            for (param2 in mongetTable){
              if (mongetTable[param2]==undefined) continue;
              if (mongetTable[param2].ClassType==monsterTable[index].ClassName){
                has = true;
                break;
              }
            }
          }
          if (has){
            genmapString += '<p>'+tos.GetMapString(serverData, serverData['tableData']['map2'][param].ClassName)+'</p>';
          }
        }

        var output = layout_detail.toString();
        output = output.replace(/%Icon%/g, tos.ImagePathToHTML(serverData['imagePath'][monsterTable[index].Icon.toLowerCase()]));
        output = output.replace(/%IconPath%/g, serverData['imagePath'][monsterTable[index].Icon.toLowerCase()] == undefined ? '' : serverData['imagePath'][monsterTable[index].Icon.toLowerCase()].path);
        output = output.replace(/%Name%/g, monsterTable[index].Name);
        output = output.replace(/%ClassName%/g, monsterTable[index].ClassName);
        output = output.replace(/%ClassID%/g, monsterTable[index].ClassID);
        output = output.replace(/%Desc%/g, monsterTable[index].Desc);

        output = output.replace(/%Level%/g, monsterTable[index].Level);
        output = output.replace(/%Attribute%/g, tos.AttributeToName(serverData, monsterTable[index].Attribute));
        output = output.replace(/%RaceType%/g, tos.ClassName2Lang(serverData, monsterTable[index].RaceType));
        output = output.replace(/%ArmorMaterial%/g, tos.ClassName2Lang(serverData, monsterTable[index].ArmorMaterial));
        output = output.replace(/%MoveType%/g, tos.ClassName2Lang(serverData, monsterTable[index].MoveType));
        output = output.replace(/%Size%/g, monsterTable[index].Size);
        output = output.replace(/%MonRank%/g, monsterTable[index].MonRank);
        output = output.replace(/%StatType%/g, monsterTable[index].StatType);

        output = output.replace(/%SkillString%/g, skillString);
        output = output.replace(/%GenMapString%/g, genmapString);

        output = output.replace(/%StatScript%/g, statScript);


        if (serverSetting['dbconfig'] == undefined){
          output = output.replace(/%Comment%/g, '');
        } else {
          var connection = new mysqls(serverSetting['dbconfig']);
          var comment_results = connection.query('SELECT * FROM comment WHERE state=0 AND page="Monster" AND page_arg1="'+''+'" AND page_arg2='+request.query.id+' ORDER BY time DESC;');
          if (comment_results != undefined){
            for (param in comment_results){
              var nickname_results = connection.query('SELECT * FROM user WHERE userno="'+comment_results[param].userno+'";');
              if (nickname_results!=undefined && nickname_results.length>0){
                comment_results[param]["nickname"]=nickname_results[0].nickname;
              }
            }
          }
          if (request.session.login_userno == undefined){
            output = output.replace(/%Comment%/g, dbLayout.Layout_Comment(undefined,'Monster','',request.query.id,comment_results));
          } else {
            var user_results = connection.query('SELECT * FROM user WHERE userno="'+request.session.login_userno+'";');
            output = output.replace(/%Comment%/g, dbLayout.Layout_Comment(user_results[0],'Monster','',request.query.id,comment_results));
          }
          connection.dispose();
        }

        response.send(output);
    }
  
    return route;
  }