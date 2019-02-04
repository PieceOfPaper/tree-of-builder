module.exports = function(app, dbclient){
    var express = require('express');
    var fs = require('fs');
    
    var route = express.Router();
    route.get('/', function (req, res) {
        res.send('no data');
    });

    return route;
}