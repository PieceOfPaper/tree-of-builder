module.exports = function(app, serverSetting, tableData, scriptData){
    var express = require('express');
    var fs = require('fs');
    var mysql = require('mysql');
    var bodyParser = require('body-parser')
    
    var route = express.Router();
    route.get('/', function (req, res) {
        console.log((new Date()).toISOString()+' [ReqDBLog] '+req.ip+' '+req.originalUrl);
        req.session.login_userno = undefined;
        res.send('<script> window.location.href=".."; </script>');
    });

    return route;
}