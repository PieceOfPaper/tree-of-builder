module.exports = function(app, serverSetting, tableData, scriptData){
    var express = require('express');
    var fs = require('fs');
    var mysql = require('mysql');
    var bodyParser = require('body-parser');
    var md5 = require('md5');
    var sha256 = require('sha256');

    var route = express.Router();
    route.get('/', function (req, res) {
        if (serverSetting['dbconfig'] == undefined){
            res.send('<script> window.location.href=".."; </script>');
            console.warn('db-config undefined.');
            return;
        }
        if (req.query.id != undefined && req.query.id.length > 0){
            console.log((new Date()).toISOString()+' [ReqDBLog] '+req.ip+' '+req.originalUrl);
            var connection = mysql.createConnection(serverSetting['dbconfig']);
            connection.on('error', function() {});
            connection.connect();
            connection.query('UPDATE user SET mail_auth="A" WHERE mail_auth="'+req.query.id+'";', function (error, results, fields) {
                if (error) throw error;
                if (results == undefined || results.length == 0){
                    res.send('<script> alert("Authentication Fail."); window.location.href=".."; </script>');
                    connection.end();
                    return;
                }
                res.send('<script> alert("Authentication Success."); window.location.href=".."; </script>');
                connection.end();
                return;
            });
        }
        //res.send('not send');
    });

    return route;
}