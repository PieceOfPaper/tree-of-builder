module.exports = function(app, tableData, scriptData){
    var express = require('express');
    var fs = require('fs');
    //var url = require('url');
    var tos = require('../my_modules/TosModule');
    
    var route = express.Router();
  
    var layout = fs.readFileSync('./web/Layout/misc_guildEvent.html');
    route.get('/', function (request, response) {
        var guildEventTable = tableData['guild_event'];

        var output = layout.toString();
        var resultString = '';
        
        for (param in guildEventTable){
            resultString += '<h2>'+guildEventTable[param].Name+'</h2>';
            resultString += '<p>GuildLv.'+guildEventTable[param].GuildLv+'</p>';
            resultString += '<table class="search-result-table"><tbody>';
            resultString += '<tr><td>Type</td><td colspan="3">'+guildEventTable[param].EventType+'</td></tr>';
            resultString += '<tr><td>Max Player</td><td colspan="3">'+guildEventTable[param].MaxPlayerCnt+'</td></tr>';
            resultString += '<tr><td>Time Limit</td><td>'+guildEventTable[param].TimeLimit+'</td><td>Recruiting Sec</td><td>'+guildEventTable[param].RecruitingSec+'</td></tr>';
            resultString += '<tr><td>Start Map</td><td>'+tos.GetMapString(tableData,guildEventTable[param].StartMap)+'</td><td>Boss</td><td>'+tos.GetMonsterString(tableData,guildEventTable[param].BossName)+'</td></tr>';
            resultString += '<tr><td colspan="4">'+guildEventTable[param].SummaryInfo+'<br/>'+guildEventTable[param].DetailInfo+'</td></tr>';
            resultString += '</tbody></table><br/><br/>';
        }

        output = output.replace(/%ResultString%/g, resultString);
        response.send(output);
    });
    return route;
}