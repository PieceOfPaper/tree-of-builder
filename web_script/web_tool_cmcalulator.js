module.exports = function(app, serverSetting, serverData){
    var express = require('express');
    var fs = require('fs');
    //var url = require('url');
    var tos = require('../my_modules/TosModule');
    
    var route = express.Router();
  
    // var layout = fs.readFileSync('./web/Layout/tool_cmcalulator.html');
    route.get('/', function (request, response) {
        tos.RequestLog(request);

        fs.readFile('./web/Layout/tool_cmcalulator.html', function(err, data){
            if (err) {
                response.send('');
                return;
            }
            var output = data.toString();
            output = output.replace(/%SilverForm%/g, '<input type="checkbox" id="CMSilver_Check" checked>'+tos.GetItemImgString(serverData,'Vis')+' <input type="number" id="CMSilver_Count" value=1><br/>');
            output = output.replace(/%PlaniumForm%/g, '<input type="checkbox" id="CMPlanium_Check">'+tos.GetItemImgString(serverData,'misc_Planium')+' <input type="number" id="CMPlanium_Count" value=0> <input type="number" id="CMPlanium_Silver" value=0><br/>');
            output = output.replace(/%SierraForm%/g, '<input type="checkbox" id="CMSierra_Check">'+tos.GetItemImgString(serverData,'misc_ore23')+' <input type="number" id="CMSierra_Count" value=0> <input type="number" id="CMSierra_Silver" value=0><br/>');
            response.send(output);
        });
    });
    return route;
}