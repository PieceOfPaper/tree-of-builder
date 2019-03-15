module.exports = function(app, serverSetting, tableData, scriptData){
    var express = require('express');
    var fs = require('fs');
    //var url = require('url');
    var tos = require('../my_modules/TosModule');
    
    var route = express.Router();
  
    var layout = fs.readFileSync('./web/Layout/misc_companion.html');
    route.get('/', function (request, response) {
        tos.RequestLog(request);
        var companionTable = tableData['companion'];

        var output = layout.toString();
        var resultString = '';
        
        resultString += '<table class="search-result-table"><tbody>';
        resultString += '<tr><td>Icon</td><td>Name</td><td>Job</td><td>Ride Speed</td><td>Is Ride</td></tr>';
        for (param in companionTable){
            resultString += '<tr>';
            var nameStr = tos.GetMonsterString(tableData, companionTable[param].ClassName.trim());
            if (nameStr == undefined || nameStr.length == 0) nameStr = companionTable[param].ClassName.replace(/_/g,' ');
            var monData = undefined;
            var iconString = '<img style="width: 64px; height: 64px;" src="" />';
            if (companionTable[param].ClassName != undefined && companionTable[param].ClassName.length>0){
                monData = tos.FindDataClassName(tableData, 'monster', companionTable[param].ClassName);
                if (monData != undefined){
                    iconString = '<img style="width: 64px; height: 64px;" src="../img/icon/monillust/'+monData.Icon.toLowerCase()+'.png" />';
                }
            }
            var jobData = undefined;
            var jobNameString = '';
            if (companionTable[param].JobID != undefined && companionTable[param].JobID>0){
                jobData = tos.FindDataClassID(tableData, 'job', companionTable[param].JobID);
                if (jobData != undefined) {
                    jobNameString = jobData.Name;
                }
            }
            resultString += '<td>'+iconString+'</td>';
            resultString += '<td>'+nameStr+'</td>';
            resultString += '<td>'+jobNameString+'</td>';
            //resultString += '<td>'+companionTable[param].AddSpeed+'</td>';
            resultString += '<td>'+companionTable[param].RideMSPD+'</td>';
            //resultString += '<td>'+companionTable[param].IsPet+'</td>';
            resultString += '<td>'+companionTable[param].IsRide+'</td>';
            //resultString += '<td>'+companionTable[param].RidingOnly+'</td>';
            //resultString += '<td>'+companionTable[param].IsVehicle+'</td>';
            //resultString += '<td>'+companionTable[param].RideOffAtHit+'</td>';
            resultString += '</tr>';
        }
        resultString += '</tbody></table><br/>';

        output = output.replace(/%ResultString%/g, resultString);
        response.send(output);
    });
    return route;
}