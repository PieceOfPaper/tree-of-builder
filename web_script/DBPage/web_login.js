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
            console.log(results);
            console.log(fields);
            if (results == undefined || results.length == 0){
                //no data
            }
        });

        res.send('<script> window.history.back(); </script>');
    });

    return route;
}