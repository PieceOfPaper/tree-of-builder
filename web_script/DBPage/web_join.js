module.exports = function(app, tableData, scriptData, connection){
    var express = require('express');
    var fs = require('fs');
    var mysql = require('mysql');
    var bodyParser = require('body-parser')
    
    var route = express.Router();
    route.post('/', function (req, res) {
        var email = req.body.email;
        var pwd = req.body.pwd;
        var nickname = req.body.nickname;

        var index = 0;

        connection.query('SELECT * FROM user;', function (error, results, fields) {
            if (error) throw error;
            if (results != undefined && results.length > 0){
                index = results.length;
            }
        });

        connection.query('INSERT INTO user VALUES ('+index+',"'+email+'","'+pwd+'","'+nickname+'");', function (error, results, fields) {
            if (error) throw error;
        });

        res.send('<script> window.location.href=".."; </script>');
    });

    return route;
}