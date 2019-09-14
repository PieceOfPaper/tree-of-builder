module.exports = function(app, serverSetting, serverData){
    var express = require('express');
    var fs = require('fs');
    //var url = require('url');
    var tos = require('../my_modules/TosModule');
    
    var route = express.Router();
  
    var layout = fs.readFileSync('./web/Layout/tool_cmcalulator.html');
    route.get('/', function (request, response) {
        tos.RequestLog(request);

        var output = layout.toString();

        output = output.replace(/%SilverForm%/g, '<input type="checkbox" id="CMSilver_Check" checked>'+tos.GetItemImgString(serverData,'Vis')+' <input type="number" id="CMSilver_Count" value=750000><br/>');
        output = output.replace(/%PlaniumForm%/g, '<input type="checkbox" id="CMPlanium_Check">'+tos.GetItemImgString(serverData,'misc_Planium')+' <input type="number" id="CMPlanium_Count" value=0.05> <input type="number" id="CMPlanium_Silver" value=2000000><br/>');
        output = output.replace(/%SierraForm%/g, '<input type="checkbox" id="CMSierra_Check">'+tos.GetItemImgString(serverData,'misc_ore23')+' <input type="number" id="CMSierra_Count" value=15> <input type="number" id="CMSierra_Silver" value=9000><br/>');
        response.send(output);
    });
    return route;
}