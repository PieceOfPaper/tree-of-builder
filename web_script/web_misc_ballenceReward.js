module.exports = function(app, serverSetting, tableData, scriptData){
    var express = require('express');
    var fs = require('fs');
    //var url = require('url');
    var tos = require('../my_modules/TosModule');
    
    var route = express.Router();
  
    var layout = fs.readFileSync('./web/Layout/misc_shop.html');
    route.get('/', function (request, response) {
        tos.RequestLog(request);
        var brTable = tableData['job_ballenceReward'];

        var output = layout.toString();
        var resultString = '';

        resultString += '<p>'+brTable[0].RewardDay_Start+' ~ '+brTable[0].RewardDay_End+'</p>';
        resultString += '<table class="misc-result-table"><tbody>';
        resultString += '<tr><td>Job</td><td>Job Change Point</td><td>Reward Items</td></tr>';
        for (param in brTable){
            if (brTable[param].ClassID <= 1) continue;
            if (brTable[param].JobChangePoint == 0 && (brTable[param]['RewardItem_1']==undefined || brTable[param]['RewardItem_1'].length==0)) continue;
            var jobData = tos.FindDataClassName(tableData,'job',brTable[param].ClassName);
            if (jobData == undefined) continue;
            resultString += '<tr>';
            resultString += '<td>';
            if (jobData.Icon != undefined ){
                resultString += '<img style="width:64px; height:64px;" src="../img/icon/classicon/'+jobData.Icon.toLowerCase()+'.png" />';
            }
            resultString += '<p>'+jobData.Name+'</p>';
            resultString += '</td>';
            resultString += '<td>'+brTable[param].JobChangePoint.toLocaleString()+'</td>';
            
            resultString += '<td>';
            for (var i=1;i<=6;i++){
                if (brTable[param]['RewardItem_'+i] == undefined || brTable[param]['RewardItem_'+i].length == 0) continue;
                var splited = brTable[param]['RewardItem_'+i].split('/');
                if (splited == undefined || splited.length == 0) continue;
                var itemcount = 1;
                if (splited.length > 1) itemcount = splited[1];
                resultString += tos.GetItemResultString(tableData,splited[0],itemcount);
            }
            resultString += '</td>';
            resultString += '</tr>';
        }
        resultString += '</tbody></table>';

        output = output.replace(/%ResultString%/g, resultString);
        response.send(output);
    });
    return route;
}