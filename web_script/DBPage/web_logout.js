module.exports = function(app, tableData, scriptData, connection){
    var express = require('express');
    var fs = require('fs');
    var mysql = require('mysql');
    var bodyParser = require('body-parser')
    
    var route = express.Router();
    route.get('/', function (req, res) {
        req.session.login_userno = undefined;
        res.send('<script> window.location.href=".."; </script>');
    });

    return route;
}