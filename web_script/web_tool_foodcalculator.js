module.exports = function(app, serverSetting, tableData, scriptData, imagePath){
    var express = require('express');
    var fs = require('fs');
    //var url = require('url');
    var tos = require('../my_modules/TosModule');
    
    var route = express.Router();
  
    var layout = fs.readFileSync('./web/Layout/tool_foodcalculator.html');
    route.get('/', function (request, response) {
        tos.RequestLog(request);
        var foodTable = tableData['foodtable'];

        var output = layout.toString();
        var resultString = '';
        var totalMaterials = [];
        for (var i = 0; i < foodTable.length; i ++){
            resultString += '<br/>';
            resultString += '<div>';
            resultString += '<h3><img style="width:64px; height:64px; vertical-align:middle;" src="../img/icon/itemicon/'+foodTable[i].Icon.toLowerCase()+'.png" />'+foodTable[i].Name+'</h3>';
            resultString += '<p>Count <input type="number" id="cnt-'+i+'" value=0 onchange="updateCount()"></p>';
            resultString += '<button class="lv-add-button minus" onclick="onclick_add('+i+',-1)"><img src="../img/button/btn_minus_cursoron.png" /></button>';
            resultString += '<button class="lv-add-button plus" onclick="onclick_add('+i+',1)"><img src="../img/button/btn_plus_cursoron.png" /></button>';
            var material = foodTable[i].Material.split('/');
            for (var j=0;j<material.length;j+=2){
                resultString += tos.GetItemResultString(tableData, material[j], imagePath, '<span class="matcnt" id="matcnt-'+i+'-'+material[j]+'">'+material[j+1]+'</span>');
                if (totalMaterials.includes(material[j])==false) totalMaterials.push(material[j]);
            }
            resultString += '</div>';
        }
        resultString += '<br/><br/><h3>Total</h3>';
        for (var j=0;j<totalMaterials.length;j++){
            resultString += tos.GetItemResultString(tableData, totalMaterials[j], imagePath, '<span class="matcnt" id="totalmatcnt-'+totalMaterials[j]+'">'+0+'</span>');
        }
        resultString += '<script> var foodTable='+JSON.stringify(foodTable)+'</script>';

        output = output.replace(/%ResultString%/g, resultString);
        response.send(output);
    });
    return route;
}