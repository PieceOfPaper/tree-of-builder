module.exports = function(app, serverSetting, tableData, scriptData, imagePath){
    var express = require('express');
    var fs = require('fs');
    //var url = require('url');
    var tos = require('../my_modules/TosModule');
    
    var route = express.Router();
  
    var layout = fs.readFileSync('./web/Layout/misc_eventbanner.html');
    route.get('/', function (request, response) {
        tos.RequestLog(request);
        var eventbannerTable = tableData['event_banner'];

        var output = layout.toString();
        var resultString = '';
        
        for (param in eventbannerTable){
            var imgPath = '';
            if (eventbannerTable[param].ImagePath!=undefined){
                var imgPathData = imagePath[eventbannerTable[param].ImagePath.toLowerCase()];
                if (imgPathData != undefined) {
                    imgPath = imgPathData.path;
                }
            }
            resultString += '<table class="search-result-table"><tbody>';
            resultString += '<tr><td>Class ID</td><td>'+eventbannerTable[param].ClassID+'</td></tr>';
            resultString += '<tr><td>Name</td><td>'+eventbannerTable[param].Name+'</td></tr>';
            resultString += '<tr><td>Time</td><td>'+timeTextForm(eventbannerTable[param].StartTimeYYYYMM,eventbannerTable[param].StartTimeDDHHMM)+' ~ '+timeTextForm(eventbannerTable[param].EndTimeYYYYMM,eventbannerTable[param].EndTimeDDHHMM)+'</td></tr>';
            resultString += '<tr><td colspan="2"><a href="'+eventbannerTable[param].url+'" target="_blank" ><img style="max-width:calc(100vw - 24px); width:fit-content !important; height:auto !important;" src="'+imgPath+'"/></a></td></tr>';
            resultString += '</tbody></table><br/>';
        }

        output = output.replace(/%ResultString%/g, resultString);
        response.send(output);
    });

    function timeTextForm(YYYYMM,DDHHMM){
        var output = '';
        output += Math.floor(YYYYMM/100).toString()+'-';
        output += (YYYYMM%100).toString()+'-';
        output += Math.floor(DDHHMM/10000).toString()+' ';
        output += (Math.floor(DDHHMM/10000)%100).toString()+':';
        if (DDHHMM%100 < 10) output += '0'+(DDHHMM%100).toString();
        else output += (DDHHMM%100).toString();
        return output;
    }

    function parseTime(YYYYMM,DDHHMM){
    }
    return route;
}