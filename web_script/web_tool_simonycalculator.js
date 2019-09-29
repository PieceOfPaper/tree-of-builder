module.exports = function(app, serverSetting, serverData){
    var express = require('express');
    var fs = require('fs');
    //var url = require('url');
    var tos = require('../my_modules/TosModule');
    
    var route = express.Router();
  
    var layout = fs.readFileSync('./web/Layout/tool_simonycalculator.html');
    route.get('/', function (request, response) {
        tos.RequestLog(request);
        var skillTable = serverData['tableData']['skill'];
        var simonySkills = [];
        var simonyMax = {};

        var materials = {
            2: "misc_runeStone",
            4: "misc_parchment",
        };

        var output = layout.toString();
        var index = 0;
        var resultString = '';
        for (var i = 0; i < skillTable.length; i ++){
            if (skillTable[i]['CanMakeSimony'] != 'YES') continue;
            simonySkills.push(skillTable[i]);
            simonyMax[skillTable[i].ClassName] = { Type:tos.GetJobNumber1(tos.GetSkilltree(serverData,skillTable[i].ClassName).ClassName), MaxLevel:tos.GetSkillMaxLevel(serverData,skillTable[i].ClassName) };
            resultString += '<div style="text-align:center; display: inline-block; vertical-align: top;">';
            resultString += tos.ImagePathToHTML(serverData['imagePath']['icon_'+skillTable[i].Icon.toLowerCase()], 64);
            resultString += '<p>'+skillTable[i].Name+'</p>';
            resultString += '<input class="lv-add-input" style="width:64px;" type="number" id="cnt-'+index+'" value=0 onchange="updateCount()"><br>';
            resultString += '<button class="lv-add-button minus" onclick="onclick_add('+index+',-1)"><img src="../img2/button/btn_minus_cursoron.png" /></button>';
            resultString += '<button class="lv-add-button plus" onclick="onclick_add('+index+',1)"><img src="../img2/button/btn_plus_cursoron.png" /></button>';
            var material = materials[tos.GetJobNumber1(tos.GetSkilltree(serverData,skillTable[i].ClassName).ClassName)];
            resultString += '<p>'+tos.GetItemResultString(serverData, material, '<span class="matcnt" id="matcnt-'+index+'-'+material+'">'+tos.GetSkillMaxLevel(serverData,skillTable[i].ClassName)+'</span>')+'</p>';
            resultString += '</div>';
            index ++;
        }
        resultString += '<br/><br/><h3>Total Materials</h3>';

        var totalMaterials = ['misc_parchment', 'misc_runeStone'];
        var materialPrices = {};
        for (var j=0;j<totalMaterials.length;j++){
            materialPrices[totalMaterials[j]] = tos.FindDataClassName(serverData, 'item', totalMaterials[j]).Price;

            resultString += '<p>';
            resultString += tos.GetItemResultString(serverData, totalMaterials[j], '<span class="matcnt" id="totalmatcnt-'+totalMaterials[j]+'">'+0+'</span>');
            resultString += '(' + tos.GetItemImgString(serverData, 'Vis');
            resultString += '<span class="matcnt" id="totalmatprice-'+totalMaterials[j]+'">'+0+'</span>)';
            resultString += '</p>';
        }
        resultString += '<p>';
        resultString += tos.GetItemResultString(serverData, 'Vis', '<span class="matcnt" id="totalmatcnt-Vis">'+0+'</span>');
        resultString += '</p>';
        resultString += '<br/><h3>Total Price</h3>';
        resultString += tos.GetItemResultString(serverData, 'Vis', '<span class="matcnt" id="totalmatprice">'+0+'</span>');
        // resultString += '<script> var foodTable='+JSON.stringify(foodTable)+'; var materialPrice='+JSON.stringify(materialPrices)+';</script>';


        var scriptString = '';
        scriptString += '<script>';
        scriptString += 'var simonySkills='+JSON.stringify(simonySkills)+';\n'
        scriptString += 'var simonyMax='+JSON.stringify(simonyMax)+';\n'
        scriptString += 'var materials='+JSON.stringify(materials)+';\n'
        scriptString += 'var materialPrices='+JSON.stringify(materialPrices)+';\n'
        scriptString += '</script>';

        output = output.replace(/%ResultString%/g, resultString);
        output = output.replace(/%ScriptString%/g, scriptString);
        response.send(output);
    });
    return route;
}