module.exports = function(app, serverSetting, serverData){
    var express = require('express');
    var fs = require('fs');
    //var url = require('url');
    var tos = require('../my_modules/TosModule');
    
    var route = express.Router();
  
    var layout = fs.readFileSync('./web/Layout/tool_foodcalculator.html');
    route.get('/', function (request, response) {
        tos.RequestLog(request);
        var foodTable = serverData['tableData']['foodtable'];

        var output = layout.toString();
        var resultString = '';
        var totalMaterials = [];
        for (var i = 0; i < foodTable.length; i ++){
            resultString += '<div style="text-align:center; display: inline-block; vertical-align: top;">';
            resultString += tos.ImagePathToHTML(serverData['imagePath'][foodTable[i].Icon.toLowerCase()], 64);
            resultString += '<p>'+foodTable[i].Name+'</p>';
            resultString += '<input class="lv-add-input" style="width:64px;" type="number" id="cnt-'+i+'" value=0 onchange="updateCount()"><br>';
            resultString += '<button class="lv-add-button minus" onclick="onclick_add('+i+',-1)"><img src="../img2/button/btn_minus_cursoron.png" /></button>';
            resultString += '<button class="lv-add-button plus" onclick="onclick_add('+i+',1)"><img src="../img2/button/btn_plus_cursoron.png" /></button>';
            var material = foodTable[i].Material.split('/');
            for (var j=0;j<material.length;j+=2){
                resultString += '<p>'+tos.GetItemResultString(serverData, material[j], '<span class="matcnt" id="matcnt-'+i+'-'+material[j]+'">'+material[j+1]+'</span>')+'</p>';
                if (totalMaterials.includes(material[j])==false) totalMaterials.push(material[j]);
            }
            resultString += '</div>';
        }
        resultString += '<br/><br/><h3>Total Materials</h3>';
        var materialPrices = {};
        for (var j=0;j<totalMaterials.length;j++){
            materialPrices[totalMaterials[j]] = tos.FindDataClassName(serverData, 'item', totalMaterials[j]).Price;

            resultString += '<p>';
            resultString += tos.GetItemResultString(serverData, totalMaterials[j], '<span class="matcnt" id="totalmatcnt-'+totalMaterials[j]+'">'+0+'</span>');
            resultString += '(' + tos.GetItemImgString(serverData, 'Vis');
            resultString += '<span class="matcnt" id="totalmatprice-'+totalMaterials[j]+'">'+0+'</span>)';
            resultString += '</p>';
        }
        resultString += '<br/><h3>Total Price</h3>';
        resultString += tos.GetItemResultString(serverData, 'Vis', '<span class="matcnt" id="totalmatprice">'+0+'</span>');
        resultString += '<script> var foodTable='+JSON.stringify(foodTable)+'; var materialPrice='+JSON.stringify(materialPrices)+';</script>';

        output = output.replace(/%ResultString%/g, resultString);
        response.send(output);
    });
    return route;
}