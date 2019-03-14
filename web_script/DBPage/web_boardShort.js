module.exports = function(app, tableData, scriptData, dbconfig){
    var express = require('express');
    var fs = require('fs');
    var mysql = require('mysql');
    var mysqls = require('sync-mysql');
    var bodyParser = require('body-parser');
    var moment = require('moment');
    
    var route = express.Router();
    route.post('/ReqWrite', function (req, res) {
        console.log((new Date()).toISOString()+' [ReqDBLog] '+req.ip+' '+req.originalUrl+' '+JSON.stringify(req.body));
        var userno = req.body.userno;
        var value = req.body.value;
        var connection = new mysqls(dbconfig);

        var index = 0;

        var shortboard_results = connection.query('SELECT * FROM board_short;');
        if (shortboard_results!=undefined && shortboard_results.length>0){
            index = shortboard_results[shortboard_results.length-1].idx + 1;
        }
        var mysqlTimestamp = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
        var insert_results = connection.query('INSERT INTO board_short (idx,userno,time,value) VALUES ('+index+','+userno+',"'+mysqlTimestamp+'","'+value+'");');
        res.send('<script> window.location = document.referrer; </script>');
    });

    return route;
}