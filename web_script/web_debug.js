module.exports = function(app, serverSetting, tableData, scriptData, imagePath){
    var express = require('express');
    var fs = require('fs');
    //var url = require('url');
    var tos = require('../my_modules/TosModule');
    var pidusage = require('pidusage');
    
    var route = express.Router();
  
    route.get('/', function (request, response) {
        tos.RequestLog(request);

        var output = '';

        output += '';
        
        output += 'CPU USAGE (system): ' + process.cpuUsage().system;
        output += '<br/>';
        output += 'CPU USAGE (user): ' + process.cpuUsage().user;

        output += '<br/>';
        output += '<br/>';

        const memused = process.memoryUsage();
        for (let key in memused) {
            output += `MEMORY USAGE (${key}): ${Math.round(memused[key] / 1024 / 1024 * 100) / 100} MB`;
            output += '<br/>';
        }
        output += '<br/>';

        output += '<hr>';
        output += '<br/>';

        output += 'pidusage';
        output += '<br/>';
        pidusage(process.pid, function (err, stats) {
            //console.log(stats);
            // => {
            //   cpu: 10.0,            // percentage (from 0 to 100*vcore)
            //   memory: 357306368,    // bytes
            //   ppid: 312,            // PPID
            //   pid: 727,             // PID
            //   ctime: 867000,        // ms user + system time
            //   elapsed: 6650000,     // ms since the start of the process
            //   timestamp: 864000000  // ms since epoch
            // }
            for (param in stats){
                output += param+': ' + stats[param];
                output += '<br/>';
            }
            output += '<br/>';
            response.send(output);
          });
          console.log('end');
    });
      
  
    return route;
  }