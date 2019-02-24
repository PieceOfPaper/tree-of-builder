module.exports = function(app, tableData, scriptData, connection){
    var express = require('express');
    var fs = require('fs');
    var mysql = require('mysql');
    var bodyParser = require('body-parser');
    var md5 = require('md5');
    var sha256 = require('sha256');
    
    var route = express.Router();
    route.post('/', function (req, res) {
        var email = req.body.email;

        connection.query('SELECT * FROM user WHERE email="'+email+'";', function (error, results, fields) {
            if (error) throw error;
            if (results == undefined || results.length == 0){
                res.send('<script> alert("Not Exist User"); window.location.href=".."; </script>');
                return;
            } else {
                var pwd = sha256(req.body.pwd + results[0].pwd_salt);
                if (pwd == results[0].pwd) {
                    req.session.login_userno = results[0].userno;
                    res.send('<script> window.location.href=".."; </script>');
                } else {
                    res.send('<script> alert("Not Match Password"); window.location.href=".."; </script>');
                }
            }
        });

    });

    return route;
}