module.exports = function(app, tableData, scriptData, connection){
    var express = require('express');
    var fs = require('fs');
    var mysql = require('mysql');
    var bodyParser = require('body-parser')
    
    var route = express.Router();
    route.post('/', function (req, res) {
        var email = req.body.email;
        var pwd = req.body.pwd;

        connection.query('SELECT * FROM user WHERE email="'+email+'" AND pwd="'+pwd+'";', function (error, results, fields) {
            if (error) throw error;
            if (results == undefined || results.length == 0){
                res.send('<script> alert("No Data"); window.location.href=".."; </script>');
                return;
            } else {
                req.session.login_userno = results[0].userno;
                res.send('<script> window.location.href=".."; </script>');
            }
        });

    });

    return route;
}