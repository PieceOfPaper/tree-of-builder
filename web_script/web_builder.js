module.exports = function(app, tableData){
    var express = require('express');
    var fs = require('fs');
    var url = require('url');

    var tos = require('../my_modules/TosModule');
    
    var route = express.Router();
  
    var builder_script = fs.readFileSync('./web/Builder/builder_script.html');
  
    route.get('/', function (request, response) {
        var jobTable = tableData['job'];
        var skillTable = tableData['skill'];
        var skilltreeTable = tableData['skilltree'];
        var skillAttributeTable = tableData['skill_attribute'];

        var classArray = [];
        var skillArray = [];
        var classCount = [];
        if (request.query.class != undefined && request.query.class.length > 0){
            for (var i = 0; i < jobTable.length; i ++){
                classCount.push(0);
            }
            for (var i = 0; i < request.query.class.length; i ++){
                classArray.push(AsciiToNumber(request.query.class[i]));
                if (i > 0){
                    for (var j = 0; j < jobTable.length; j ++){
                        if (GetJobNumber1(jobTable[j].ClassName) === classArray[0] &&
                            GetJobNumber2(jobTable[j].ClassName) === classArray[i]){
                            classCount[j] ++;
                            break;
                        }
                    }
                }
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

        var output = '<html>';
        output +=   '<head>';
        output +=     '<title>Builder Page</title>';
        output +=     '<link rel="stylesheet" type="text/css" href="../Layout/style.css">';
        output +=     '<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />';
        output +=   '</head>';
        output +=   '<body>';
        output += fs.readFileSync('./web/Layout/topMenu.html');
        output +=       '<div class="builder-class-area">';
        output +=           '<div class="builder-class-selected">';
        if (request.query.class === undefined || request.query.class === ''){
            //선택된 클래스가 없음.
        } else {
           for (var i = 1; i < classArray.length; i ++){
                var jobData = tos.GetJobData(tableData, classArray[0], classArray[i]);
                if (jobData === undefined) continue;
                output +=   '<btn class="builder-class-btn" onclick="onClickClassDelete(' + i + ')">';
                output +=       '<img src="../img/icon/classicon/' + jobData.Icon + '.png" />';
                output +=   '</btn>';
           } 
        }
        output +=           '</div>';
        output +=           '<h3>' + (classArray.length - 1) + ' Rank</h3>';
        output +=           '<hr>';
        output +=           '<div class="builder-class-select">';
        if (request.query.class === undefined || request.query.class === ''){
            for (var i = 1; i <= 4; i ++){
                var jobData = tos.GetJobData(tableData, i, 1);
                if (jobData === undefined) continue;
                output +=   '<btn class="builder-class-btn" onclick="onClickClass(' + i + ',1)">';
                output +=       '<img src="../img/icon/classicon/' + jobData.Icon + '.png" />';
                output +=   '</btn>';
            }
        } else {
            var jobList = [];
            for (var i = 0; i < jobTable.length; i ++){
                if (GetJobNumber1(jobTable[i].ClassName) != classArray[0]) continue;
                if (jobTable[i].Rank > request.query.class.length) continue;
                if (jobTable[i].MaxCircle <= classCount[i]) continue;
                jobList.push(jobTable[i]);
            }
            for (var i = 0; i < jobList.length; i ++){
                output +=   '<btn class="builder-class-btn" onclick="onClickClass(' + classArray[0] + ',' + GetJobNumber2(jobList[i].ClassName) + ')">';
                output +=       '<img src="../img/icon/classicon/' + jobList[i].Icon + '.png" />';
                output +=   '</btn>';
            }
        }
        output +=           '</div>';
        output +=       '</div>';
        output +=       '<hr>';
        output +=       '<div class="builder-skill-area">';
        var skillIndex = 0;
        for (var i = 0; i < classCount.length; i ++){
            if (classCount[i] <= 0)
                continue;
            output +=       '<div class="class">';
            output +=       '<h3>' + jobTable[i].Name + ' ' + classCount[i] + ' Circle</h3>';
            var jobNum2 = GetJobNumber2(jobTable[i].ClassName);
            var skillLvSum = 0;
            for (var k = 0; k < skillArray.length; k ++){
                if (skillArray[k][0] == jobNum2){
                    for (var l = 2; l < skillArray[k].length; l +=2){
                        skillLvSum += skillArray[k][l + 1];
                    }
                }
            }
            output +=       '<p>(<span id="' + jobNum2 + '" class="skillLvSum">' + skillLvSum + '</span>/' + (classCount[i] * 15) + ')</p>';
            for (var j = 0; j < skilltreeTable.length; j ++){
                if (skilltreeTable[j].ClassName.indexOf(jobTable[i].ClassName + '_') > -1 &&
                    skilltreeTable[j].UnlockGrade <= classCount[i]){
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
                    var skillLvMax = (classCount[i] - skilltreeTable[j].UnlockGrade + 1) * skilltreeTable[j].LevelPerGrade;
                    if (skillLvMax > skilltreeTable[j].MaxLevel) skillLvMax = skilltreeTable[j].MaxLevel;
                    output +=   '<div align="center" class="skill" id="' + skillTable[skillTableIndex].ClassID + '" >';
                    output +=       '<img src="../img/icon/skillicon/icon_' + skillTable[skillTableIndex].Icon  + '.png"/>';
                    output +=       '<br>';
                    output +=       '<button onclick="addSkillLevel(' + jobNum2 + ',' + skilltreeTable[j].UnlockGrade + ',' + skillIndex+ ',' + skillLvMax + ',1)">+</button>';
                    output +=       '<button onclick="addSkillLevel(' + jobNum2 + ',' + skilltreeTable[j].UnlockGrade + ',' + skillIndex+ ',' + skillLvMax + ',-1)">-</button>';
                    output +=       '<p><a href="../Skill/?id=' + skillTable[skillTableIndex].ClassID  + '">' + skillTable[skillTableIndex].Name + '</a><br/> (<span id="' + jobNum2 + ',' + skillIndex + '" class="skillLv">' + skillLv + '</span>/' + skillLvMax + ')</p>';
                    output +=   '</div>';
                    skillIndex ++;
                }
            }
            output +=       '</div>';
            skillIndex = 0;
        }
        output +=       '</div>';
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
            return ascii - 65 + 26;
        }
        return -1;
    }

    function NumberToAscii(num){
        if (num >= 0 && num <= 9){
            return String.fromCharCode(48 + num);
        } else if (num >= 10 && num <= 35){
            return String.fromCharCode(97 + num - 10);
        } else if (num >= 36 && num <= 51){
            return String.fromCharCode(65 + num - 26);
        }
    }
  
    return route;
  }