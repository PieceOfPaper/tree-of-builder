module.exports = function(app, serverSetting, serverData){
    var express = require('express');
    var fs = require('fs');
    //var url = require('url');
    var tos = require('../my_modules/TosModule');
    
    var route = express.Router();
  
    var layout = fs.readFileSync('./web/Layout/tool_cmcalulator.html');
    route.get('/', function (request, response) {
        tos.RequestLog(request);

        var ogtitle = '';
        if (request.query != undefined && request.query.InputSilver!=undefined){
            var input = Number(request.query.InputSilver);
            var unitSilver = Number(0);
            if (request.query.CMSilver_Count!=undefined){
                unitSilver += Number(request.query.CMSilver_Count);
            }
            if (request.query.CMPlanium_Silver!=undefined&&request.query.CMPlanium_Count!=undefined){
                unitSilver += Number(request.query.CMPlanium_Silver) * Number(request.query.CMPlanium_Count);
            }
            if (request.query.CMSierra_Silver!=undefined&&request.query.CMSierra_Count!=undefined){
                unitSilver += Number(request.query.CMSierra_Silver) * Number(request.query.CMSierra_Count);
            }
            var result = Math.ceil(input / unitSilver).toLocaleString();
            ogtitle = '마!! 그거 사는데 챌린지 '+result+'번 밖에 안되네!';
        } else {
            ogtitle = 'Challenge Mode Silver Calcurator';
        }

        var challengeItem = tos.FindDataClassName(serverData, 'item', 'CHALLENG_PORTAL_Team');
        var imgPath = tos.getImagePath(serverData, challengeItem.Icon);

        var output = layout.toString();

        output = output.replace(/%OGTitle%/g, ogtitle);
        output = output.replace(/%OGDesc%/g, '엄살 부리지 마라!');
        output = output.replace(/%OGImgPath%/g, imgPath);

        output = output.replace(/%SilverForm%/g, '<input type="checkbox" id="CMSilver_Check" checked>'+tos.GetItemImgString(serverData,'Vis')+' <input type="number" id="CMSilver_Count" value=1><br/>');
        output = output.replace(/%PlaniumForm%/g, '<input type="checkbox" id="CMPlanium_Check">'+tos.GetItemImgString(serverData,'misc_Planium')+' <input type="number" id="CMPlanium_Count" value=0> <input type="number" id="CMPlanium_Silver" value=0><br/>');
        output = output.replace(/%SierraForm%/g, '<input type="checkbox" id="CMSierra_Check">'+tos.GetItemImgString(serverData,'misc_ore23')+' <input type="number" id="CMSierra_Count" value=0> <input type="number" id="CMSierra_Silver" value=0><br/>');
        response.send(output);
    });
    return route;
}