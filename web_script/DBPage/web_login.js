module.exports = function(app, connection){
    var express = require('express');
    var fs = require('fs');
    var mysql = require('mysql');
    
    var route = express.Router();
    route.post('/', function (req, res) {
        res.send('no data');
    });
    route.get('/', function (req, res) {

        // connection.connect();
        // connection.query('create table user( sno int not null, name char(10), det char(20), addr char(80), tel char(20), primary key(sno) );', function (error, results, fields) {
        //     if (error) throw error;
        //     console.log('The solution is: ', results[0].solution);
        // });
        // connection.end();

        res.send('no data');
    });

    return route;
}