module.exports = function(app, serverSetting, serverData){
    var express = require('express');
    var fs = require('fs');
    //var url = require('url');
    var tos = require('../my_modules/TosModule');
    
    var route = express.Router();
  
    var layout = fs.readFileSync('./web/Layout/misc_companion.html');
    route.get('/', function (request, response) {
        tos.RequestLog(request);
        var companionTable = serverData['tableData']['companion'];

        var output = layout.toString();
        var resultString = '';
        
        resultString += '<table class="search-result-table"><tbody>';
        resultString += '<tr><td>Monster</td><td>Job</td><td>Ride Speed</td><td>Is Ride</td></tr>';
        for (param in companionTable){
            resultString += '<tr>';
            var nameStr = tos.GetMonsterString(serverData, companionTable[param].ClassName.trim());
            if (nameStr == undefined || nameStr.length == 0) nameStr = companionTable[param].ClassName.replace(/_/g,' ');
            var jobData = undefined;
            var jobNameString = '';
            if (companionTable[param].JobID != undefined && companionTable[param].JobID>0){
                jobData = tos.FindDataClassID(serverData, 'job', companionTable[param].JobID);
                if (jobData != undefined) {
                    jobNameString = jobData.Name;
                }
            }
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