module.exports = function(app, serverSetting, serverData){
    var express = require('express');
    var fs = require('fs');
    var url = require('url');

    var tos = require('../my_modules/TosModule');
    
    var route = express.Router();
  
    var builder_script = fs.readFileSync('./web/Builder/builder_script.html');
  
    route.get('/', function (request, response) {
        tos.RequestLog(request);
        var jobTable = serverData['tableData']['job'];
        var skillTable = serverData['tableData']['skill'];
        var skilltreeTable = serverData['tableData']['skilltree'];
        var skillAttributeTable = serverData['tableData']['skill_attribute'];
        var abilityTable = serverData['tableData']['ability'];
        var abilityJobTable = serverData['tableData']['ability_job'];

        var usedScrName = [ "SkillFactor", "SkillSR", "CaptionTime", "CaptionRatio", "CaptionRatio2", "CaptionRatio3", "SpendItemCount" ];
        var CLASS_MAX = 4;

        var luaMethodList = [];

        var classArray = [];
        var skillArray = [];
        //var classCount = [];
        var abilityArray = [];
        if (request.query.class != undefined && request.query.class.length > 0){
            // for (var i = 0; i < jobTable.length; i ++){
            //     classCount.push(0);
            // }
            for (var i = 0; i < request.query.class.length; i ++){
                classArray.push(AsciiToNumber(request.query.class[i]));
                // if (i > 0){
                //     for (var j = 0; j < jobTable.length; j ++){
                //         if (GetJobNumber1(jobTable[j].ClassName) === classArray[0] &&
                //             GetJobNumber2(jobTable[j].ClassName) === classArray[i]){
                //             classCount[j] ++;
                //             break;
                //         }
                //     }
                // }
            }
        }
        if (request.query.skill != undefined && request.query.skill.length > 0){
            var splited_query_skill = request.query.skill.split(".");
            for (var i = 0; i < splited_query_skill.length; i ++){
                var skill = [];
                for (var j = 0; j < splited_query_skill[i].length; j ++){
                    skill.push(AsciiToNumber(splited_query_skill[i][j]));
                }
                skillArray.push(skill);
            }
        }
        if (request.query.ability != undefined && request.query.ability.length > 0){
            var splited_query_ability = request.query.ability.split(".");
            for (var i = 0; i < splited_query_ability.length; i ++){
                if (splited_query_ability[i].length == 0) continue;
                var ability = [];
                ability.push(AsciiToNumber(splited_query_ability[i][0]));
                for (var j = 1; j < splited_query_ability[i].length; j += 3){
                    ability.push(AsciiToNumber(splited_query_ability[i][j]));

                    var ten = AsciiToNumber(splited_query_ability[i][j + 1]) * getNumberAsciiMax();
                    var one = AsciiToNumber(splited_query_ability[i][j + 2]);
                    ability.push(ten + one);
                }
                abilityArray.push(ability);
            }
        }

        var output = '<html>';
        output +=   '<head>';
        output +=     '<title>Builder Page</title>';
        output +=     '<link rel="stylesheet" type="text/css" href="../style.css">';
        output +=     '<link rel="icon" href="../img2/minimap_icons/questinfo_return.png">';
        output +=     '<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />';
        output +=     '<script async src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>';
        output +=     '<script>(adsbygoogle = window.adsbygoogle || []).push({ google_ad_client: "ca-pub-2172243042066207", enable_page_level_ads: true }) </script>';
        output +=     '<script src="../js/defaultSetting.js"></script>';
        output +=     '<script src="../js/tga.js"></script>';
        output +=   '</head>';
        output +=   '<body>';
        //output += fs.readFileSync('./web/Layout/topMenu.html');
        output +=       '<div class="top-menu" align="center"></div><script>onInitTopMenu(false);</script>';
        output +=       '<div class="builder-class-area">';
        output +=           '<div class="builder-class-selected">';
        if (request.query.class === undefined || request.query.class === ''){
            //선택된 클래스가 없음.
            output +=   '<h1 style="width:calc(100vw-20px); text-align:center;">Select Class</h1>';
        } else {
           for (var i = 1; i < classArray.length; i ++){
                var jobData = tos.GetJobData(serverData, classArray[0], classArray[i]);
                if (jobData === undefined) continue;
                output +=   '<btn class="builder-class-btn" onclick="onClickClassDelete(' + i + ')">';
                //output +=       '<img class="class-icon" src="../img/icon/classicon/' + jobData.Icon.toLowerCase() + '.png" />';
                output +=       tos.ImagePathToHTML(serverData['imagePath'][jobData.Icon.toLowerCase()], 50);
                output +=       '<div class="class-name">' + jobData.Name + '</div>';
                output +=   '</btn>';
           } 
        }
        output +=           '</div>';
        output +=           '<h3>' + (classArray.length - 1) + ' Rank</h3>';
        output +=           '<hr>';
        output +=           '<div class="builder-class-select">';
        if (request.query.class === undefined || request.query.class === ''){
            for (var i = 0; i < jobTable.length; i ++){
                if (jobTable[i].Rank > 1) continue;
                output +=   '<div class="builder-class-btn" onclick="onClickClass(' + GetJobNumber1(jobTable[i].ClassName) + ',1)">';
                //output +=       '<img class="class-icon"src="../img/icon/classicon/' + jobTable[i].Icon.toLowerCase() + '.png" />';
                output +=       tos.ImagePathToHTML(serverData['imagePath'][jobTable[i].Icon.toLowerCase()], 50);
                output +=       '<div class="class-name">' + jobTable[i].Name + '</div>';
                output +=   '</div>';
            }
            // for (var i = 1; i <= 4; i ++){
            //     var jobData = tos.GetJobData(serverData['tableData'], i, 1);
            //     if (jobData === undefined) continue;
            //     output +=   '<btn class="builder-class-btn" onclick="onClickClass(' + i + ',1)">';
            //     output +=       '<img src="../img/icon/classicon/' + jobData.Icon.toLowerCase() + '.png" />';
            //     output +=   '</btn>';
            // }
        } else if (classArray.length <= CLASS_MAX) {
            var jobList = [];
            for (var i = 0; i < jobTable.length; i ++){
                if (GetJobNumber1(jobTable[i].ClassName) != classArray[0]) continue;
                if (jobTable[i].Rank > request.query.class.length) continue;
                //if (jobTable[i].MaxCircle <= classCount[i]) continue;
                var isHas = false;
                for (var j = 1; j < classArray.length; j ++){
                    var jobData = tos.GetJobData(serverData, classArray[0], classArray[j]);
                    if (jobData != undefined && jobData.ClassID == jobTable[i].ClassID){
                        isHas = true;
                        break;
                    }
                }
                if (isHas) continue;
                jobList.push(jobTable[i]);
            }
            for (var i = 0; i < jobList.length; i ++){
                output +=   '<div class="builder-class-btn" onclick="onClickClass(' + classArray[0] + ',' + GetJobNumber2(jobList[i].ClassName) + ')">';
                //output +=       '<img class="class-icon" src="../img/icon/classicon/' + jobList[i].Icon.toLowerCase() + '.png" />';
                output +=       tos.ImagePathToHTML(serverData['imagePath'][jobList[i].Icon.toLowerCase()], 50);
                output +=       '<div class="class-name">' + jobList[i].Name + '</div>';
                output +=   '</div>';
            }
        }
        output +=           '</div>';
        output +=       '</div>';
        output +=       '<hr>';
        //output +=       '<button id="viewDetailBtn" onclick="onClickViewDetail()">View Details</button>';
        output +=       '<div class="builder-skill-area">';
        output +=       '<script>var skillData=[]; var abilityData=[];  var abilityJobData=[];</script>';
        var skillIndex = 0;
        for (var i = 1; i < classArray.length; i ++){
            // if (classCount[i] <= 0)
            //     continue;
            var jobData = tos.GetJobData(serverData, classArray[0], classArray[i]);
            if (jobData == null || jobData.hasOwnProperty('Name') == false) continue;
            output +=       '<div class="class">';
            //output +=       '<h3>' + jobData.Name + ' ' + classCount[i] + ' Circle</h3>';
            output +=       '<h3>' + jobData['Name'] + '</h3>';
            var jobNum2 = GetJobNumber2(jobData.ClassName);
            var skillLvSum = 0;
            for (var k = 0; k < skillArray.length; k ++){
                if (skillArray[k][0] == jobNum2){
                    for (var l = 2; l < skillArray[k].length; l +=2){
                        skillLvSum += skillArray[k][l + 1];
                    }
                }
            }
            //output +=       '<p>(<span id="' + jobNum2 + '" class="skillLvSum">' + skillLvSum + '</span>/' + (classCount[i] * 45) + ')</p>';
            var skillPointMax = jobNum2 == 1 ? 15 : 45;
            output +=       '<p>Skill Point: <span id="' + jobNum2 + '" class="skillLvSum">' + skillLvSum + '</span>/' + skillPointMax + '</p>';
            output +=       '<p>Ability Point: <span id="' + jobNum2 + '" class="abilityPntSum"></span></p>';
            // ------ Skill
            for (var j = 0; j < skilltreeTable.length; j ++){
                if (skilltreeTable[j].ClassName.indexOf(jobData.ClassName + '_') > -1){
                    var skillTableIndex;
                    for (var k = 0; k < skillTable.length; k ++){
                        if (skilltreeTable[j].SkillName === skillTable[k].ClassName){
                            skillTableIndex = k;
                            break;
                        }
                    }
                    var skillLv = 0;
                    for (var k = 0; k < skillArray.length; k ++){
                        if (skillArray[k][0] == jobNum2 && skillArray[k][1] == skilltreeTable[j].UnlockGrade){
                            for (var l = 2; l < skillArray[k].length; l +=2){
                                if (skillArray[k][l] == skillIndex){
                                    skillLv = skillArray[k][l + 1];
                                }
                            }
                        }
                    }
                    // var skillLvMax = (classCount[i] - skilltreeTable[j].UnlockGrade + 1) * skilltreeTable[j].LevelPerGrade;
                    // if (skillLvMax > skilltreeTable[j].MaxLevel) skillLvMax = skilltreeTable[j].MaxLevel;
                    var skillLvMax = skilltreeTable[j].MaxLevel;
                    output +=   '<div align="center" class="skill" id="' + skillTable[skillTableIndex].ClassID + '" >';
                    //output +=       '<img class="skill-icon" src="../img/icon/skillicon/icon_' + skillTable[skillTableIndex].Icon.toLowerCase()  + '.png" onclick="onClickSkillIcon(' + jobNum2 + ',' + skillIndex+ ')"/>';
                    output +=       tos.ImagePathToHTML(serverData['imagePath']['icon_'+skillTable[skillTableIndex].Icon.toLowerCase()], 64, 'onclick="onClickSkillIcon(' + jobNum2 + ',' + skillIndex+ ')"');
                    output +=       '<br>';
                    output +=       '<p style="font-size:0.8em;">Lv.<span id="' + jobNum2 + ',' + skillIndex + '" class="skillLv">' + skillLv + '</span> / ' + skillLvMax + '</p>';
                    output +=       '<button class="lv-add-button minus" onclick="addSkillLevel(' + jobNum2 + ',' + 1 + ',' + skillIndex+ ',' + skillLvMax + ',-1)"><img src="../img2/button/btn_minus_cursoron.png" /></button>';
                    output +=       '<button class="lv-add-button plus" onclick="addSkillLevel(' + jobNum2 + ',' + 1 + ',' + skillIndex+ ',' + skillLvMax + ',1)"><img src="../img2/button/btn_plus_cursoron.png" /></button>';
                    //output +=       '<p><a href="../Skill/?id=' + skillTable[skillTableIndex].ClassID  + '">' + skillTable[skillTableIndex].Name + '</a>(<span id="' + jobNum2 + ',' + skillIndex + '" class="skillLv">' + skillLv + '</span>/' + skillLvMax + ')</p>';
                    // output +=       '<div align="center" class="skill-desc" id="' + skillTable[skillTableIndex].ClassID + '" >';
                    // output +=           '<p>' + tos.parseCaption(skillTable[skillTableIndex].Caption) + '</p>';
                    // output +=           '<p>' + tos.parseCaption(skillTable[skillTableIndex].Caption2) + '</p>';
                    // output +=       '</div>';
                    output +=       '<script>';
                    output +=           'skillData["'+jobNum2+'_'+skillIndex+'"]=' + JSON.stringify(skillTable[skillTableIndex]) + ';';
                    output +=           'skillData["'+jobNum2+'_'+skillIndex+'"]["Level"]=Number('+skillLv+');';
                    output +=           'skillData["'+jobNum2+'_'+skillIndex+'"]["FullCaption"]="' + tos.parseCaption(skillTable[skillTableIndex].Caption).replace(/\"/g, '\'') + '<br/>' + tos.parseCaption(skillTable[skillTableIndex].Caption2).replace(/\"/g, '\'') + '";';
                    output +=       '</script>';
                    output +=   '</div>';


                    for (var k=0;k<usedScrName.length;k++){
                        if (skillTable[skillTableIndex][usedScrName[k]]==undefined) continue;
                        if (skillTable[skillTableIndex][usedScrName[k]]=='') continue;
                        if (luaMethodList.includes(skillTable[skillTableIndex][usedScrName[k]])) continue;
                        luaMethodList.push(skillTable[skillTableIndex][usedScrName[k]]);
                    }

                    skillIndex ++;
                }
            }
            output +=   '<br/>';
            // ------ Ability
            var abilIndex = 0;
            for (var j = 0; j < abilityTable.length; j ++){
                if (abilityTable[j].Job == jobData.ClassName){
                    var abil_job = undefined;
                    for (var k = 0; k < abilityJobTable.length; k ++){
                        if (abilityTable[j].ClassName == abilityJobTable[k].ClassName){
                            abil_job = abilityJobTable[k];
                            break;
                        }
                    }
                    if (abil_job == undefined) continue;
                    var abilLv = 0;
                    for (var k = 0; k < abilityArray.length; k ++){
                        if (abilityArray[k][0] == jobNum2){
                            for (var l = 1; l < abilityArray[k].length; l +=2){
                                if (abilityArray[k][l] == abilIndex){
                                    abilLv = abilityArray[k][l + 1];
                                }
                            }
                        }
                    }
                    output +=   '<div align="center" class="ability" id="' + abilityTable[j].ClassID + '" >';
                    //output +=       '<img class="ability-icon" src="../img/icon/skillicon/' + abilityTable[j].Icon.toLowerCase()  + '.png" onclick="onClickAbilityIcon(' + jobNum2 + ',' + abilIndex+ ')"/>';
                    output +=       tos.ImagePathToHTML(serverData['imagePath'][abilityTable[j].Icon.toLowerCase()], 64, 'onclick="onClickAbilityIcon(' + jobNum2 + ',' + abilIndex+ ')"');
                    output +=       '<br>';
                    output +=       '<p style="font-size:0.8em;"><span id="' + jobNum2 + ',' + abilIndex + '" class="abilityLv">' + abilLv + '</span> / ' + abil_job.MaxLevel + '</p>';
                    output +=       '<button class="lv-add-button minus" onclick="addAbilLevel(' + jobNum2 + ',' + abilIndex + ',' + abil_job.MaxLevel + ',-1)"><img src="../img2/button/btn_minus_cursoron.png" /></button>';
                    output +=       '<button class="lv-add-button plus" onclick="addAbilLevel(' + jobNum2 + ',' + abilIndex + ',' + abil_job.MaxLevel + ',1)"><img src="../img2/button/btn_plus_cursoron.png" /></button>';
                    // output +=       '<div align="center" class="ability-desc" id="' + abilityTable[j].ClassID + '" >';
                    // output +=           '<p>' + abil_job.UnlockDesc + '</p>';
                    // output +=           '<p>' + tos.parseCaption(abilityTable[j].Desc) + '</p>';
                    // output +=       '</div>';
                    output +=       '<input type="hidden" id="Ability_' + abilityTable[j].ClassName + '" class="AbilityData" min="0" max="' + abil_job.MaxLevel + '" value="0" >';
                    output +=       '<script>';
                    output +=           'abilityData["'+jobNum2+','+abilIndex+'"]=' + JSON.stringify(abilityTable[j]) + ';';
                    output +=           'abilityJobData["'+jobNum2+','+abilIndex+'"]=' + JSON.stringify(abil_job) + ';';
                    output +=           'abilityData["'+jobNum2+','+abilIndex+'"]["Level"]=Number('+abilLv+');';
                    output +=           'abilityData["'+jobNum2+','+abilIndex+'"]["FullCaption"]="' + abil_job.UnlockDesc + '<br/><br/>' + tos.parseCaption(abilityTable[j].Desc).replace(/\"/g, '\'') + '";';
                    output +=       '</script>';
                    output +=   '</div>';

                    if (luaMethodList.includes(abil_job.ScrCalcPrice) == false) {
                        luaMethodList.push(abil_job.ScrCalcPrice);
                    }

                    abilIndex ++;
                }
            }
            output +=       '</div>';
            skillIndex = 0;
        }
        output +=       '</div>';

        //dummy
        output +=       '<div style="height:50vh;"></div>';

        //Desc Area
        output +=   '<div class="builder-desc-area">';
        output +=   '<h3 id="desc-name"></h3>';
        output +=   '<p id="desc-desc"></p>';
        output +=   '</div>';

        output +=   '<script>';

        output +=       'var tableData = {};';
        output +=       'tableData["HiddenAbility_Reinforce"]='+JSON.stringify(serverData['tableData']['HiddenAbility_Reinforce'])+';';
    

        output += 'function GetSkillOwner(skill){ return playerSetting; }';

        output +=       'function GetAbility(pc, ability){';
        output +=           'if(document.getElementById("Ability_" + ability)!=undefined){';
        output +=               'return { Level:Number(document.getElementById("Ability_" + ability).value) }; }';
        output +=           'return undefined; }';

        output += 'function TryGetProp(data, prop, defValue){ ';
        output +=  'if (data[prop] === undefined) {';
        output +=    'if (defValue != undefined) return defValue;'; 
        output +=    'return 0; }';
        output +=  'return data[prop];'; 
        output += '}';

        output +=       'function GetSkill(pc, className){';
        output +=           'for(var param in skillData){';
        output +=               'if(skillData[param].ClassName==className) return skillData[param];';
        output +=           '}';
        output +=           'return undefined;';
        output +=       '}';

        output +=       'function IsBuffApplied(pc, buff){ return false; }';
        output +=       'function IGetSumOfEquipItem(pc, equip){ return 0; }';
        output +=       'function IsPVPServer(pc){ return 0; }';
        output +=       'function SCR_CALC_BASIC_MDEF(pc){ return 0; }';
        output +=       'function GetZoneName(pc){ return 0; }';
        output +=       'function IsPVPField(pc){ return 0; }';
        output +=       'function GetAbilityAddSpendValue(pc, className, property){ return 0; }';
        
        output +=       'function GetClass(tableName, className){';
        output +=        'for(param in tableData[tableName]){ if (tableData[tableName][param]["ClassName"]==className) return tableData[tableName][param]; }';
        output +=        'return 0;';
        output +=       '}';

        output +=   'var methods=[];';
        luaMethodList.push('SCR_ABIL_ADD_SKILLFACTOR');
        luaMethodList.push('SCR_ABIL_ADD_SKILLFACTOR_TOOLTIP');
        luaMethodList.push('SCR_REINFORCEABILITY_TOOLTIP');
        luaMethodList.push('ABIL_COMMON_PRICE');
        luaMethodList.push('SCR_Get_SkillFactor_Reinforce_Ability');
        for (var i=0;i<luaMethodList.length;i++){ 
            if (serverData['scriptData'][luaMethodList[i]] == undefined) continue;
            if (luaMethodList[i] == 'ABIL_REINFORCE_PRICE' || luaMethodList[i] == 'ABIL_COMMON_PRICE'){
                output += tos.Lua2JS(serverData['scriptData'][luaMethodList[i]]).replace('return price, time', 'return price').replace('var price, time', 'var price').replace('{ 1, 2, 3, 4, 5,','[ 1, 2, 3, 4, 5,').replace('6, 7, 8, 8.5, 9 }','6, 7, 8, 8.5, 9 ]').replace('#increseFactorList','increseFactorList.length').replace('baseFactor^(abilLevel - 1) * increseFactorList[index]','Math.pow(baseFactor,(abilLevel - 1)) * increseFactorList[index-1]');
            } else if (luaMethodList[i] == 'SCR_GET_SR_LV') {
                output += tos.Lua2JS(serverData['scriptData'][luaMethodList[i]]).replace('ui.GetFrame("pub_createchar"):IsVisible()', '0');
            } else {
                output += tos.Lua2JS(serverData['scriptData'][luaMethodList[i]]);
            }
            output += 'methods["'+luaMethodList[i]+'"]='+luaMethodList[i]+';';
        }

        output +=   '</script>';

        output += builder_script.toString();
        output +=   '</body>';
        output += '</html>';

        response.send(output);
    });


    function GetJobNumber1(className) {
        var replaced = className.replace('Char', '');
        var splited = replaced.split('_');
        return Number(splited[0]);
    }

    function GetJobNumber2(className) {
        var replaced = className.replace('Char', '');
        var splited = replaced.split('_');
        return Number(splited[1]);
    }

    function AsciiToNumber(char){
        var ascii = char.charCodeAt(0);
        if (ascii >= 48 && ascii <= 57){
            return ascii - 48;
        } else if (ascii >= 97 && ascii <= 122){
            return ascii - 97 + 10;
        } else if (ascii >= 65 && ascii <= 90){
            return ascii - 65 + 36;
        }
        return -1;
    }

    function NumberToAscii(num){
        if (num >= 0 && num <= 9){
            return String.fromCharCode(48 + num);
        } else if (num >= 10 && num <= 35){
            return String.fromCharCode(97 + num - 10);
        } else if (num >= 36 && num <= 61){
            return String.fromCharCode(65 + num - 36);
        }
    }

    function getNumberAsciiMax() {
        return 61;
    }
  
    return route;
  }