module.exports = function(app, tableData){
    var express = require('express');
    var fs = require('fs');
    var url = require('url');
    
    var route = express.Router();
  
    var builder_script = fs.readFileSync('./web/Builder/builder_script.html');
    var jobTable = tableData['job'];
    var skillTable = tableData['skill'];
    var skilltreeTable = tableData['skilltree'];
  
    route.get('/', function (request, response) {
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
        output +=     '<link rel="stylesheet" type="text/css" href="../style.css">';
        output +=   '</head>';
        output +=   '<body>';
        output +=       '<div class="builder-class-area">';
        output +=           '<div class="builder-class-selected">';
        if (request.query.class === undefined || request.query.class === ''){
            //선택된 클래스가 없음.
        } else {
           for (var i = 1; i < classArray.length; i ++){
                var jobData = GetJobData(classArray[0], classArray[i]);
                if (jobData === undefined) continue;
                output +=   '<btn class="builder-class-btn" onclick="onClickClassDelete(' + i + ')">';
                output +=       '<img src="../img/icon/classicon/' + jobData.Icon + '.png" />';
                output +=   '</btn>';
           } 
        }
        output +=           '</div>';
        output +=           '<br/>';
        output +=           '<div class="builder-class-select">';
        if (request.query.class === undefined || request.query.class === ''){
            for (var i = 1; i <= 4; i ++){
                var jobData = GetJobData(i, 1);
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
        output +=       '<div class="builder-skill-area">';
        var skillIndex = 0;
        for (var i = 0; i < classCount.length; i ++){
            if (classCount[i] <= 0)
                continue;
            output +=       '<div class="class">';
            output +=       '<p>' + jobTable[i].Name + ' ' + classCount[i] + ' Circle</p>';
            var jobNum2 = GetJobNumber2(jobTable[i].ClassName);
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
                    output +=   '<div class="skill" id="' + skillTable[skillTableIndex].ClassID + '" onclick="addSkillLevel(' + jobNum2 + ',' + skilltreeTable[j].UnlockGrade + ',' + skillIndex+ ',' + skillLvMax + ')">';
                    output +=       '<img src="../img/icon/skillicon/icon_' + skillTable[skillTableIndex].Icon  + '.png"/>';
                    output +=       '<p>' + skillTable[skillTableIndex].Name + ' (' + skillLv + '/' + skillLvMax + ')</p>';
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

    function GetJobData(num1, num2){
        for (var i = 0; i < jobTable.length; i ++){
            if (jobTable[i].ClassName === 'Char' + num1 + '_' + num2)
                return jobTable[i];
        }
        return undefined;
    }

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